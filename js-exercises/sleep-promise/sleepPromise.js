const sleep = ms => {
  if (typeof ms != 'number') {
    throw new TypeError(`Expected Number, got ${typeof ms}, please try again with a number.`);
  } else if (!Number.isFinite(ms)) {
    throw new Error(`Function expects a finite sleep time value, got infinite`);
  }
  const promise = new Promise(resolve => setTimeout(resolve, ms));
  const innerFn = value => {
    return promise.then(() => value);
  };
  innerFn.then = promise.then.bind(promise);
  innerFn.catch = promise.catch.bind(promise);
  return innerFn;
};

export {
  sleep
};
