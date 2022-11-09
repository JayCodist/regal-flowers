export const getKeyMap = (record: Record<string, any>) => {
  return Object.keys(record).reduce(
    (map, key) => (record[key] !== undefined ? { ...map, [key]: key } : map),
    {}
  );
};
