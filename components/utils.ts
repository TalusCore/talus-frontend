export const capitalizeFirstLetter = (
  str: string | string[] | undefined,
  defaultStr: string
): string => {
  if (Array.isArray(str)) {
    return capitalizeFirstLetter(str[0], defaultStr);
  }

  if (str === '' || str === undefined) return defaultStr;

  return str.charAt(0).toUpperCase() + str.slice(1);
};
