// copies an object, but only includes truthy values
// in the copy (empty fields omitted)

const createTruthyObject = (obj, newObj = {}) => {
  const entries = Object.entries(obj);
  for (let [k, v] of entries) {
    if (v) newObj[k] = v;
  }
  return newObj;
};

module.exports = createTruthyObject;
