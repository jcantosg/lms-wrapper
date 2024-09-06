export const formatMoodleNames = (moodleName: string): string => {
  return moodleName.replaceAll(/&nbsp;?/gi, '').trim();
};
