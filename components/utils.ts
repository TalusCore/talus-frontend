export const capitalizeFirstLetter = (str: string | string[]): string => {
  if (Array.isArray(str)) {
    return capitalizeFirstLetter(str[0]);
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str: string, maxLength: number): string => {
  return str.length > maxLength ? str.slice(0, maxLength) + '…' : str;
};
