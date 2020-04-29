const result = [];
const promiseIndex = 0;
const promiseArgs;
const totalPromisesLength;
const allPromises = [];

const sequentialPromise = (promisesArray) => {
  if (!Array.isArray(promisesArray)) {
    throw new TypeError(`Expected an array of promises, got ${typeof promiseArray}`);
  }
  totalPromisesLength = promisesArray.length;
  allPromises = promisesArray;
  let wrappedPromise = wrapIntoFunctionIfPromise(allPromises[promiseIndex]);
  return resolveAllPromises(wrappedPromise, []); //it is not receiving anything here to return
}

function resolveAllPromises(promise, promiseArgs) {
  return new Promise((resolve, reject) => {
    promise(promiseArgs).then(
      (res) => {
        promiseArgs = res;
        result.push(res);
      },
      (err) => {
        promiseArgs = err;
        result.push(err);
      }
    ).finally(() => {
      try {
        if (promiseIndex === (totalPromisesLength - 1)) {
          // console.log(result); //result is showing correct here.
          resolve(result); //here it should return promise with results
        } else {
          promiseIndex++;
          let wrappedPromise = wrapIntoFunctionIfPromise(allPromises[promiseIndex]);
          resolveAllPromises(wrappedPromise, promiseArgs);
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}

function wrapIntoFunctionIfPromise(promise) {
  let modifiedPromise;
  if (typeof promise !== 'function' && promise instanceof Promise) {
    modifiedPromise = () => promise;
  } else {
    modifiedPromise = promise;
  }
  return modifiedPromise;
}

export {
  sequentialPromise
};
