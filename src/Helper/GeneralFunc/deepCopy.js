const deepCopy = original => {
    if (Array.isArray(original)) {
      return original.map(elem => deepCopy(elem));
    } else if (typeof original === 'object' && original !== null) {
      return Object.fromEntries(
        Object.entries(original)
          .map(([k, v]) => [k, deepCopy(v)]));
    } else {
      // Primitive value: atomic, no need to copy
      return original;
    }
}

export default deepCopy;