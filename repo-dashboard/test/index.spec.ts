import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect, afterEach, vi } from 'vitest';
import worker from '../src/index';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

const makeRequest = (path: string) => new IncomingRequest(`https://example.com${path}`);

describe('repo dashboard worker', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('serves the dashboard shell on the root path', async () => {
    const request = makeRequest('/');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
    expect(body).toContain('Dashboard');
    expect(body).toContain('api/repo');
  });

  it('proxies GitHub API responses through `/api` endpoints', async () => {
    const repoPayload = { name: 'jt6602.github.io', stars: 42 };
    const filesPayload = [{ name: 'README.md', type: 'file', size: 101 }];
    const commitsPayload = [{ sha: 'abc1234', commit: { message: 'chore: update', author: { date: '2024-01-01T00:00:00Z' } } }];

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = typeof input === 'string' ? input : input instanceof Request ? input.url : '';

      if (url === 'https://api.github.com/repos/JT6602/jt6602.github.io') {
        return new Response(JSON.stringify(repoPayload), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (url === 'https://api.github.com/repos/JT6602/jt6602.github.io/contents/') {
        return new Response(JSON.stringify(filesPayload), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (url.startsWith('https://api.github.com/repos/JT6602/jt6602.github.io/commits')) {
        return new Response(JSON.stringify(commitsPayload), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (url === 'https://api.github.com/repos/JT6602/jt6602.github.io/readme') {
        return new Response(JSON.stringify({
          name: 'README.md',
          size: 2048,
          content: 'SGVsbG8sIFdvcmxkIQ=='
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      throw new Error(`Unexpected fetch call to: ${url}`);
    });

    const endpoints = ['/api/repo', '/api/files', '/api/commits', '/api/readme'];

    for (const endpoint of endpoints) {
      const request = makeRequest(endpoint);
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('application/json');
    }

    expect(fetchSpy).toHaveBeenCalledTimes(endpoints.length);
    expect(fetchSpy).toHaveBeenNthCalledWith(1, 'https://api.github.com/repos/JT6602/jt6602.github.io', expect.anything());
  });
});
