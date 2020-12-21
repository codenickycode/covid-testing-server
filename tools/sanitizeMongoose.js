const sanitizeMongoose = (request) => {
  const clean = Object.assign({}, request);
  for (let [k, v] of Object.entries(clean)) {
    if (typeof v === 'string') {
      clean[k] = v.replace(/\$/g, '_');
    }
  }
  return clean;
};

module.exports = sanitizeMongoose;
