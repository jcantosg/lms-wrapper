export enum LmsCourseCategoryEnum {
  E_LEARNING = 1,
  MIXED = 2,
  PRESENCIAL = 3,
}

export const getAllLmsCourseCategories = () => {
  return Object.values(LmsCourseCategoryEnum);
};
