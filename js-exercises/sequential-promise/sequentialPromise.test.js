import {
  sequentialPromise
} from './sequentialPromise';
const {
  performance
} = require('perf_hooks');

describe('sequentialPromise', () => {

  describe('check for invalid parameters', () => {
    test('throw an error if empty array or array of promises are not passed', () => {
      expect(() => sequentialPromise({})).toThrow(/[a-zA-Z0-9]+/);
      expect(() => sequentialPromise()).toThrow();
      expect(() => sequentialPromise([])).not.toThrow();
      expect(() => sequentialPromise('abc')).toThrow();
    });
  });

  test('should resolve 3 promises in sequence and return a promise', async () => {
    const p1 = () => new Promise((resolve) => {
      setTimeout(() => {
        resolve('dude');
      }, 1000);
    });

    const p2 = dude => new Promise((resolve) => {
      setTimeout(() => {
        resolve(`${dude}, wheres my car`);
      }, 300);
    });

    const p3 = movieName => new Promise((resolve) => {
      setTimeout(() => {
        resolve(`${movieName} is a terrible movie`);
      }, 0);
    });

    await expect(sequentialPromise([p1, p2, p3]) instanceof Promise).toBe(true);

    await expect(sequentialPromise([p1, p2, p3]))
      .resolves
      .toBe('dude, wheres my car is a terrible movie');
  });

  test('should resolve 2 promises in sequence and return a promise', async () => {
    const p1 = () => new Promise((resolve) => {
      setTimeout(() => {
        resolve('Godfather');
      }, 1000);
    });

    const p2 = movieName => new Promise((resolve) => {
      setTimeout(() => {
        resolve(`${movieName} is an awesome movie`);
      }, 0);
    });

    await expect(sequentialPromise([p1, p2])).resolves.toBe('Godfather is an awesome movie');
  });

  describe('check for correct performance time', () => {
    test('should resolve 3 promises in sequence and return a promise', async () => {
      const wait = ms => new Promise(res => setTimeout(res, ms));

      const promiseFunctions = [
        () => wait(3000),
        () => wait(6000),
        () => wait(1000),
      ];

      const start = performance.now();
      await sequentialPromise(promiseFunctions);
      const end = performance.now();
      expect(end - start).toBeGreaterThanOrEqual(10000);
    });
  });

  describe('check for time performance if promises are given', () => {
    test('should resolve 3 promises in sequence after wrapping them into a function and return a promise', async () => {
      const wait = ms => new Promise(res => setTimeout(res, ms));

      const promiseFunctions = [
        new Promise((res) => wait(1000)),
        new Promise((res) => wait(2000)),
        new Promise((res) => wait(3000))
      ];

      const start = performance.now();
      await sequentialPromise(promiseFunctions);
      const end = performance.now();
      expect(end - start).toBeGreaterThanOrEqual(6000);
    });

    test('should resolve 3 promises in sequence after wrapping them into a function and return a promise', async () => {
      const fns = [
        () => Promise.resolve(1),
        () => Promise.resolve(2),
        () => Promise.resolve(3),
      ];

      const res = await sequentialPromise(fns);
      await expect(res).resolves.toBe(3);
    });

    test('should resolve 3 promises in sequence after wrapping them into a promise and return a promise', async () => {
      const fns = [
        1,
        'hello',
        () => Promise.resolve(3),
      ];

      const res = await sequentialPromise(fns);
      await expect(res).resolves.toBe(3);
    });
  });

  describe('check for time performance if promises are given', () => {
    test('should resolve 3 promises in sequence and return a promise', async () => {
      const wait = ms => new Promise(res => setTimeout(res, ms));

      const promiseFunctions = [
        new Promise((res) => wait(1000)),
        new Promise((res) => wait(2000)),
        new Promise((res) => wait(3000))
      ];

      const start = performance.now();
      await sequentialPromise(promiseFunctions);
      const end = performance.now();
      expect(end - start).toBeGreaterThanOrEqual(6000);
    });
  });
  describe('check if one of the promise gets rejected', () => {
    test('should not continue if a promise rejects', async () => {
      const promises = [
        () => Promise.resolve('10'),
        () => Promise.reject(new Error('fails')),
        () => Promise.resolve('20'),
      ];

      let result;
      try {
        result = await sequentialPromise(promises);
      } catch (error) {
        result = error;
      }

      expect(result).rejects.toThrow('fails');
    });
  });
});
