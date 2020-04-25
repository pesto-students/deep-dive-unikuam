import {
  sleep
} from './sleepPromise';

const {
  performance
} = require('perf_hooks');
describe('check for type errors', () => {
  test('should throw error for invalid parameters', async () => {
    expect(() => sleep('abc')).toThrow();
    expect(() => sleep([])).toThrow();
    expect(() => sleep({})).toThrow();
    expect(() => sleep(Infinity)).toThrow();
    expect(() => sleep(1 / 0)).toThrow();
    expect(() => sleep('12')).toThrow();
  });
});

test('promise chain sleeping', async () => {
  const start = performance.now();
  return sleep(20)
    .then(sleep(20))
    .then(() => {
      expect(performance.now() - start).toBeGreaterThanOrEqual(40);
    });
});

test('async await', async () => {
  const start = performance.now();
  await sleep(20);
  expect(performance.now() - start).toBeGreaterThanOrEqual(19);
});

test('then', async () => {
  const start = performance.now();
  return sleep(20).then(() => {
    expect(performance.now() - start).toBeGreaterThanOrEqual(19);
  });
});

test('promise chain value passing', async () => Promise.resolve()
  .then(() => 'test')
  .then(sleep(20))
  .then((value) => {
    expect(value).toEqual('test');
  }));

test('promise chain sleeping', async () => {
  const start = performance.now();
  return Promise.resolve()
    .then(sleep(20))
    .then(() => {
      expect(performance.now() - start).toBeGreaterThanOrEqual(19);
    });
});

test('delayed sleep', async () => {
  const start = performance.now();

  const sleepPromise = sleep(20);

  await sleep(20);

  return sleepPromise.then(() => {
    const end = performance.now();

    expect(end - start).toBeGreaterThanOrEqual(19);
    expect(end - start).toBeLessThan(30);
  });
});

test('delayed promise chain sleeping', async () => {
  const start = performance.now();

  const sleepPromise = sleep(20);

  return (
    sleep(20)
    .then(() => 'test')
    // Must not sleep again because 'sleepPromise' is already resolved
    .then(sleepPromise)
    .then(() => {
      const end = performance.now();

      expect(end - start).toBeGreaterThanOrEqual(19);
      expect(end - start).toBeLessThan(30);
    })
  );
});

test('delayed promise chain value passing', async () => {
  const sleepPromise = sleep(20);

  return sleep(20)
    .then(() => 'test')
    .then(sleepPromise)
    .then((value) => {
      expect(value).toEqual('test');
    });
});
