const MINIMUM_AGE = 18;
export const checkUnderage = (date: Date): boolean => {
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age--;
  }

  return age < MINIMUM_AGE;
};
