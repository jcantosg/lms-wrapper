export enum LmsCourseCategoryEnum {
  E_LEARNING = 1,
  MIXTA = 2,
  PRESENCIAL = 3,
}

export const getAllLmsCourseCategories = () => {
  return Object.values(LmsCourseCategoryEnum);
};

export const getLmsCourseCategoryEnumValue = (value: string) => {
  return LmsCourseCategoryEnum[value as keyof typeof LmsCourseCategoryEnum];
};
