function curry(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError(`Expected function, got ${typeof fn}, please try again with a function argument`);
  }
  return function curriedFn(...args) {
    if (args.length < 1 && fn.length > 0) {
      throw new Error(`Expected at least ${fn.length} number of arguments but got ${args.length}`);
    }
    if (args.length >= fn.length) {
      return fn(...args);
    } else {
      return (...curryArgs) => curriedFn(...args.concat(curryArgs));
    }
  }
}

export {
  curry,
};
