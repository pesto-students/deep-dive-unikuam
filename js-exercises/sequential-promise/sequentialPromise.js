const sequentialPromise = promises => {
  let promise = promises[0]();
  for (let i = 1; i < promises.length; i++) {
    if (typeof promises[i] !== 'function') {
      throw new Error(`Expected array of functions as arguments, got ${typeof promises[i]}`)
    }
    promise = promise.then(promises[i]);
  }
  return Promise.resolve(promise);
};
export {
  sequentialPromise
};
