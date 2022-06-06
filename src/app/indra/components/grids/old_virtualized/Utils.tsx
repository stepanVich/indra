export const hasKey = (object: any, key: string | number | symbol): boolean => {
  return {}.hasOwnProperty.call(object, key);
};
