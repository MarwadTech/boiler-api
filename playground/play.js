const ff = (one, two) => {
  const ranges = [
    { a: 2, b: 5 },
    { a: 6, b: 9 },
    { a: 10, b: 15 },
    { a: 16, b: 18 },
  ];

  for (let index = 0; index < ranges.length; index++) {
    const { a, b } = ranges[index];
    if ((one >= a && one <= b) || (two >= a && two <= b)) {
      return true;
    }
  }

  return false;
};

console.log(ff(1, 5));
