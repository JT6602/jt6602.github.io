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

  it('returns an empty game state when no devices have synced', async () => {
    const request = makeRequest('/api/game/state');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    expect(response.headers.get('access-control-allow-origin')).toBe('*');

    const body = await response.json();
    expect(body).toMatchObject({ teams: {}, totalTeams: 11 });
  });

  it('accepts alternate progress endpoints for device sync', async () => {
    const variants = [
      { path: '/api/game/sync', teamId: 7, reason: 'sync-fallback' },
      { path: '/api/game/report', teamId: 8, reason: 'report-fallback' }
    ];

    for (const variant of variants) {
      const payload = {
        teamId: variant.teamId,
        teamName: `Team ${variant.teamId}`,
        hasStarted: true,
        hasWon: false,
        completions: Array.from({ length: 12 }, (_, index) => index < 3),
        unlocked: Array.from({ length: 12 }, (_, index) => index < 4),
        currentPuzzleIndex: 3,
        nextPuzzleIndex: 4,
        nextPuzzleLabel: 'Floor 5',
        puzzleCount: 12,
        timestamp: '2024-03-02T12:00:00Z',
        reason: variant.reason
      };

      const request = new IncomingRequest(`https://example.com${variant.path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);
      expect(response.headers.get('access-control-allow-origin')).toBe('*');

      const stateCtx = createExecutionContext();
      const stateResponse = await worker.fetch(makeRequest('/api/game/state'), env, stateCtx);
      await waitOnExecutionContext(stateCtx);
      const body = await stateResponse.json();
      const entry = body.teams?.[String(variant.teamId)];
      expect(entry).toBeTruthy();
      expect(entry.teamId).toBe(variant.teamId);
      expect(entry.nextPuzzleIndex).toBe(4);
    }
  });

  it('accepts team progress updates and exposes them via the game state endpoint', async () => {
    const progressPayload = {
      teamId: 3,
      teamName: 'Ranger Unit',
      hasStarted: true,
      hasWon: false,
      completions: [true, true, false, false],
      unlocked: [true, true, true, false],
      currentPuzzleIndex: 2,
      nextPuzzleIndex: 2,
      nextPuzzleLabel: 'Floor 3',
      puzzleCount: 12,
      timestamp: '2024-02-01T10:00:00Z',
      reason: 'puzzle-solved'
    };

    const postRequest = new IncomingRequest('https://example.com/api/game/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progressPayload)
    });

    const postCtx = createExecutionContext();
    const postResponse = await worker.fetch(postRequest, env, postCtx);
    await waitOnExecutionContext(postCtx);

    expect(postResponse.status).toBe(200);
    expect(postResponse.headers.get('access-control-allow-origin')).toBe('*');

    const stateRequest = makeRequest('/api/game/state');
    const stateCtx = createExecutionContext();
    const stateResponse = await worker.fetch(stateRequest, env, stateCtx);
    await waitOnExecutionContext(stateCtx);

    const stateBody = await stateResponse.json();
    const teamEntry = stateBody.teams?.['3'];

    expect(teamEntry).toBeTruthy();
    expect(teamEntry.teamId).toBe(3);
    expect(teamEntry.teamName).toBe('Ranger Unit');
    expect(teamEntry.hasStarted).toBe(true);
    expect(teamEntry.solved).toBe(2);
    expect(teamEntry.completions).toHaveLength(12);
    expect(teamEntry.unlocked).toHaveLength(12);
    expect(teamEntry.nextPuzzleLabel).toBe('Floor 3');
    expect(teamEntry.progressPercent).toBeGreaterThanOrEqual(0);
  });

  it('rejects malformed progress payloads with a 400 response', async () => {
    const badRequest = new IncomingRequest('https://example.com/api/game/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    const ctx = createExecutionContext();
    const response = await worker.fetch(badRequest, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body?.error).toBeTruthy();
  });
});
