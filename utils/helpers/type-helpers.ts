export const getKeyMap = (record: Record<string, any>) => {
  return Object.keys(record).reduce(
    (map, key) => (record[key] !== undefined ? { ...map, [key]: key } : map),
    {}
  );
};

/**
 * Filters out falsy values in an array.
 * Use this instead of `Boolean` in `filter(Boolean)`
 */

export const BooleanFilter = <T>(value: T): value is NonNullable<T> => {
  return Boolean(value);
};
