import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';

interface GetSubjectResponseBody {
  id: string;
  name: string;
  teacher: {
    id: string;
    name: string;
    surname1: string;
    surname2: string | null;
    avatar: string | null;
  };
  academicRecord: {
    id: string;
    name: string;
  };
  programBlock: {
    id: string;
    name: string;
  };
  lmsCourse: {
    id: number;
    name: string;
    modules: {
      resources: {
        id: number;
        name: string;
        image: string;
      }[];
      quizzes: {
        id: number;
        name: string;
      }[];
    };
  };
}

export class GetSubjectResponse {
  static create(
    subject: Subject,
    defaultTeacher: EdaeUser,
    breadCrumb: { academicRecord: AcademicRecord; programBlock: ProgramBlock },
  ): GetSubjectResponseBody {
    return {
      id: subject.id,
      name: subject.name,
      teacher: {
        id: defaultTeacher!.id,
        name: defaultTeacher!.name,
        surname1: defaultTeacher!.surname1,
        surname2: defaultTeacher!.surname2,
        avatar: defaultTeacher!.avatar,
      },
      academicRecord: {
        id: breadCrumb.academicRecord.id,
        name: breadCrumb.academicRecord.academicProgram.title.name,
      },
      programBlock: {
        id: breadCrumb.programBlock.id,
        name: breadCrumb.programBlock.name,
      },
      lmsCourse: {
        id: subject.lmsCourse!.value.id,
        name: subject.lmsCourse!.value.name,
        modules: {
          resources: subject
            .lmsCourse!.value.modules.filter(
              (module) =>
                module.name !== 'pruebaSemestral' &&
                module.name !== 'testDeEvaluacion',
            )
            .map((module) => {
              return {
                id: module.id,
                name: module.name,
                image: module.image,
              };
            }),
          quizzes: subject
            .lmsCourse!.value.modules.filter(
              (module) =>
                module.name === 'pruebaSemestral' ||
                module.name === 'testDeEvaluacion',
            )
            .map((module) => {
              return {
                id: module.id,
                name: module.name,
              };
            }),
        },
      },
    };
  }
}
