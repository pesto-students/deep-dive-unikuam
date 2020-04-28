const animalSort = animalsArray => {
  if (!Array.isArray(animalsArray)) {
    throw new TypeError(`Expected array as a function parameter, got ${typeof animalsArray}`);
  }
  animalsArray.sort((obj1, obj2) => {
    const difference = obj1.numberOfLegs - obj2.numberOfLegs;
    if (!difference) {
      return obj1.name.localeCompare(obj2.name)
    }
    return difference;
  });
  return animalsArray;
};

export {
  animalSort
};
