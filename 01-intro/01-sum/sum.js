function sum(a, b) {
  if (typeof a == 'number' && typeof b == 'number') {
    return a+b;
  } else {
    throw new TypeError(`Wrong parameter type! a:${typeof a}; b:${typeof b}`);
  }
}

module.exports = sum;
