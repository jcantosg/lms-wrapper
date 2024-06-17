export const stringWithoutWhitespaces = (string: string): string => {
  return string.replace(/\s/g, '').trim();
};
