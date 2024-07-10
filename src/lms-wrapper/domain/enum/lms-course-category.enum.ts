export enum LmsCourseCategoryEnum {
  E_LEARNING = 1443,
  MIXTA = 1444,
  PRESENCIAL = 1445,
}

export const getAllLmsCourseCategories = () => {
  return Object.values(LmsCourseCategoryEnum);
};

export const getLmsCourseCategoryEnumValue = (value: string) => {
  return LmsCourseCategoryEnum[value as keyof typeof LmsCourseCategoryEnum];
};
