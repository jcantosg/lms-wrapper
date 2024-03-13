export const formatDate = (date: Date): string => {
  const days = date.getDate().toString().padStart(2, '0');
  const months = (date.getMonth() + 1).toString().padStart(2, '0');
  const years = date.getFullYear().toString().padStart(4, '0');

  return `${years}-${months}-${days}`;
};
