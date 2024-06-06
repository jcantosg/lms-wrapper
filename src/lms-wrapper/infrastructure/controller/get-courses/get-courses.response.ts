import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';

interface GetCoursesItemResponse {
  id: number;
  name: string;
}

export class GetCoursesResponse {
  static create(lmsCourses: LmsCourse[]): GetCoursesItemResponse[] {
    return lmsCourses.map((lmsCourse: LmsCourse) => {
      return {
        id: lmsCourse.value.id,
        name: lmsCourse.value.name,
      };
    });
  }
}
