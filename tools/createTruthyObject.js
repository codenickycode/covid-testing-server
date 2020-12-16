const createTruthyObject = (obj, newObj = {}) => {
  const entries = Object.entries(obj);
  for (let [k, v] of entries) {
    if (v) newObj[k] = v;
  }
  return newObj;
};

module.exports = createTruthyObject;
