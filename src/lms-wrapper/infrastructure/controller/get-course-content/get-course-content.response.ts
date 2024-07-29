import { LmsModuleContent } from '#/lms-wrapper/domain/entity/lms-module-content';

interface LmsCourseModuleBodyResponse {
  id: number;
  name: string;
  modules: {
    id: number;
    url: string;
    name: string;
    contents: {
      id: number;
      name: string;
      url: string;
      mimeType: string;
      isCompleted: boolean;
    }[];
  }[];
}

export class GetCourseContentResponse {
  static create(courseModule: LmsModuleContent): LmsCourseModuleBodyResponse {
    return {
      id: courseModule.value.id,
      name: courseModule.value.name,
      modules: courseModule.value.modules.map((module) => {
        return {
          id: module.id,
          name: module.name,
          url: module.url,
          contents: module.contents
            ? module.contents.map((content) => {
                return {
                  id: content.id,
                  name: content.name,
                  url: content.url,
                  mimeType: content.mimeType,
                  isCompleted: content.isCompleted,
                };
              })
            : [],
        };
      }),
    };
  }
}
