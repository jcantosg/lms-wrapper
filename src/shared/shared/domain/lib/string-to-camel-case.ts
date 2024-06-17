export const stringToCamelCase = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // To delete non-ASCII characters
    .replace(/^\w|[A-Z]|\b\w/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '')
    .replace('/', '');
};
