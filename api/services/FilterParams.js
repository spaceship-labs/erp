exports.filter = function(object, keys) {
  Object.keys(object).forEach(function(key) {
    if (typeof keys === 'undefined' || typeof key === 'undefined' ) return;
    if(keys.indexOf(key) == -1) {
      delete object[key];
    }
  });
  return object;
};
