function deepEqual(firstObj, secondObj, matchDescriptors = false) {
  if (typeof matchDescriptors !== 'boolean') {
    throw new TypeError(`Expected third argument as a boolean, got ${typeof matchDescriptors}`);
  }
  if (arguments.length <= 1) {
    throw new TypeError(`Expected at least two arguments for comparison, got ${arguments.length}`);
  }
  return checkObjectEquality(firstObj, secondObj, matchDescriptors);
}

function hasSameType(...objValues) {
  return typeof objValues[0] === typeof objValues[1] && !objValues.some(el => el == null);
}

function checkObjectEquality(firstObj, secondObj, matchDescriptors) {
  if (areNulls(firstObj, secondObj)) return true;
  if (!hasSameType(firstObj, secondObj)) return false;
  if (typeof firstObj !== 'object') {
    if (typeof firstObj === 'function') {
      return firstObj.toString() === secondObj.toString();
    }
    return firstObj === secondObj;
  }
  if (!hasSameKeyLength(firstObj, secondObj)) return false;
  let isEqual = true;
  for (const [key, firstObjValue] of Object.entries(firstObj)) {
    let secondObjValue = secondObj[key];
    if (matchDescriptors) {
      const firstObjDesc = Object.getOwnPropertyDescriptor(firstObj, key);
      const secondObjDesc = Object.getOwnPropertyDescriptor(secondObj, key);
      isEqual = isEqual && hasSameDescriptors(firstObjDesc, secondObjDesc);
    }
    isEqual = isEqual && checkObjectEquality(firstObjValue, secondObjValue, matchDescriptors);
    if (!isEqual) break;
  }
  return isEqual;
}

function areNulls(...values) {
  return values.every(el => el === null);
}

function hasSameDescriptors(firstObjDesc, secondObjDesc) {
  for (const [key, firstObjDescValue] of Object.entries(firstObjDesc)) {
    const secondObjDescValue = secondObjDesc[key];
    if (Array.isArray(firstObjDescValue)) {
      return checkArrayEquality(firstObjDescValue, secondObjDescValue);
    } else if (isObject(firstObjDescValue)) {
      return checkObjectEquality(firstObjDescValue, secondObjDescValue, true);
    } else {
      if (firstObjDescValue !== secondObjDescValue) {
        return false;
      }
    }
  }
  return true;
}

function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

function checkArrayEquality(firstObjDescValue, secondObjDescValue) {
  for (const firstObjElements of firstObjDescValue) {
    let index = firstObjDescValue.indexOf(firstObjElements);
    if (isObject(firstObjDescValue[index])) {
      if (!checkObjectEquality(firstObjDescValue[index], secondObjDescValue[index], true)) {
        return false;
      } else {
        continue;
      }
    }
    if (firstObjDescValue[index] !== secondObjDescValue[index]) {
      return false;
    }
  }
  return true;
}

function hasSameKeyLength(firstObj, secondObj) {
  const firstObjKeys = Object.getOwnPropertyNames(firstObj);
  const secondObjKeys = Object.getOwnPropertyNames(secondObj);
  return firstObjKeys.length === secondObjKeys.length;
}

export {
  deepEqual,
};
