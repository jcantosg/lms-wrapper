import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { LmsModule } from '#/lms-wrapper/domain/entity/lms-course';

interface GetSubjectResponseBody {
  id: string;
  name: string;
  lmsCourse: {
    id: number;
    name: string;
    modules: {
      id: number;
      name: string;
      image: string;
    }[];
  };
}

export class GetSubjectResponse {
  static create(subject: Subject): GetSubjectResponseBody {
    return {
      id: subject.id,
      name: subject.name,
      lmsCourse: {
        id: subject.lmsCourse!.value.id,
        name: subject.lmsCourse!.value.name,
        modules: subject.lmsCourse!.value.modules.map(
          (lmsModule: LmsModule) => {
            return {
              id: lmsModule.id,
              name: lmsModule.name,
              image: lmsModule.image,
            };
          },
        ),
      },
    };
  }
}
