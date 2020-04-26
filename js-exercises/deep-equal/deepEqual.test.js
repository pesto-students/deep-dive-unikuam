import {
  deepEqual
} from "./deepEqual";

describe("deep equal testing", () => {
  describe("check for invalid parameters", () => {
    test("throw an error if passed parameters are invalid", () => {
      expect(() => deepEqual({}, 'abc', 4)).toThrow();
      expect(() => deepEqual({}, {}, {})).toThrow();
      expect(() => deepEqual('abc')).toThrow();
      expect(() => deepEqual({}, {})).not.toThrow();
      expect(() => deepEqual('abc', 'abc')).not.toThrow();
      expect(() => deepEqual()).toThrow();
    });
  });

  describe("check for primitives", () => {
    test("should return true if matches", () => {
      expect(deepEqual('abc', 'abc')).toBe(true);
      expect(deepEqual(1, 1)).toBe(true);
      expect(deepEqual(1, 1, true)).toBe(true);
    });
  });

  describe("check deep equality for simple objects", () => {
    test("should return true if object exactly matches", () => {
      expect(deepEqual({
        a: 5
      }, {
        a: 5
      }, true)).toBe(true);
      expect(deepEqual({
        a: 5,
        b: 2
      }, {
        a: 5,
        b: 2
      }, true)).toBe(true);
      expect(deepEqual({
        a: 5,
        b: [1, 2]
      }, {
        a: 5,
        b: [1, 2]
      }, true)).toBe(true);
      expect(deepEqual({
        a: 5,
        b: [{
          name: 'anshul'
        }, 2]
      }, {
        a: 5,
        b: [{
          name: 'anshul'
        }, 2]
      }, true)).toBe(true);
      expect(deepEqual({
        a: 5,
        b: [{
          name: 'anshul'
        }, 2]
      }, {
        a: 5,
        b: [{
          name: 'anshul'
        }, 2]
      })).toBe(true);
      expect(deepEqual({
        a: 5
      }, {
        a: 5
      })).toBe(true);
      expect(deepEqual(null, null)).toBe(true);
      expect(deepEqual(null, undefined)).toBe(false);
      expect(deepEqual([1, 2], [1, 2])).toBe(true);
      expect(deepEqual({
        0: {
          name: "anshul",
          age: 23
        },
        1: {
          name: "anshul",
          age: 23
        }
      }, {
        0: {
          name: "anshul",
          age: 23
        },
        1: {
          name: "anshul",
          age: 23
        }
      })).toBe(true);
      expect(deepEqual({
        0: {
          name: "anshul",
          age: 23
        },
        1: {
          name: "anshul",
          age: 23
        }
      }, {
        0: {
          name: "anshul",
          age: 23
        },
        1: {
          name: "anshul",
          age: 23
        }
      }, true)).toBe(true);
    });
    test("should return true if deeply equal", () => {
      const obj1 = {
        a: 5
      };
      const obj2 = {};
      Object.defineProperty(obj2, "a", {
        value: 5
      });
      expect(deepEqual(obj1, obj2)).toBe(true);
      expect(deepEqual(obj1, obj2, true)).toBe(false);
    });
  });

  describe("check deep equality for objects containing functions", () => {
    test("should return true if object exactly matches", () => {
      const func1 = () => {
        return 'abc';
      }
      const func2 = () => {
        return 'abc';
      }
      expect(deepEqual(func1, func2)).toBe(true);
      expect(deepEqual(func1, func1)).toBe(true);
    });
  });

  describe("check deep equality for objects with multiple childs", () => {
    test("should return true if object exactly matches", () => {
      expect(deepEqual({
        a: {
          b: {
            c: {
              d: 1
            }
          }
        },
        e: 2,
        f: {
          g: 3
        }
      }, {
        a: {
          b: {
            c: {
              d: 1
            }
          }
        },
        e: 2,
        f: {
          g: 3
        }
      })).toBe(true);
      expect(deepEqual({
        a: {
          b: {
            c: {
              d: 1
            }
          }
        },
        e: 2,
        f: {
          g: 1
        }
      }, {
        a: {
          b: {
            c: {
              d: 1
            }
          }
        },
        e: 2,
        f: {
          g: 3
        }
      })).toBe(false);
      expect(deepEqual({
        a: {
          b: {
            c: {
              d: 1
            }
          }
        },
        e: 2,
        f: {
          g: 3
        }
      }, {
        a: {
          b: {
            c: {
              d: 1
            }
          }
        },
        e: 2,
        f: {
          g: 3
        }
      }, true)).toBe(true);

    });
  });

  describe("check deep equality for objects containing array, strings, functions, child objects", () => {
    test("should return true if object exactly matches", () => {
      expect(deepEqual({
        a: {
          b: {
            c: {
              d: 'abc'
            }
          }
        },
        e: () => {
          return {
            z: 1
          }
        },
        f: {
          g: [1, 2],
          h: false
        }
      }, {
        a: {
          b: {
            c: {
              d: 'abc'
            }
          }
        },
        e: () => {
          return {
            z: 1
          }
        },
        f: {
          g: [1, 2],
          h: false
        }
      })).toBe(true);
      expect(deepEqual({
        a: {
          b: {
            c: {
              d: 'abc'
            }
          }
        },
        e: () => {
          return {
            z: 1
          }
        },
        f: {
          g: [1, 2],
          h: false
        }
      }, {
        a: {
          b: {
            c: {
              d: 'abc'
            }
          }
        },
        e: () => {
          return {
            k: 1
          }
        },
        f: {
          g: [1, 2],
          h: false
        }
      })).toBe(false);
    });
  });

  describe("check deep equally for objects created with new keywords", () => {
    test("should return true if object exactly matches", () => {
      const obj1 = new Number(3);
      const obj2 = new Number(3);
      const obj3 = new String('abc');
      const obj4 = new String('abc');
      const obj5 = new Boolean('abc');
      const obj6 = new Boolean('abc');
      expect(deepEqual(obj1, obj1)).toBe(true);
      expect(deepEqual(obj1, obj2)).toBe(true);
      expect(deepEqual(obj3, obj4)).toBe(true);
      expect(deepEqual(obj3, obj3)).toBe(true);
      expect(deepEqual(obj5, obj6)).toBe(true);
      expect(deepEqual(obj6, obj6)).toBe(true);
    });
  });

});
