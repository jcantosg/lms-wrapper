export const formatMoodleDescriptions = (moodleDescription: string): string => {
  return moodleDescription
    .replace(/<[^>]*>/g, '')
    .replace(/(\r\n|\n|\r)/gm, '');
};
