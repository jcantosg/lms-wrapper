import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';

interface GetStudentAcademicRecordResponseBody {
  id: string;
  blocks: {
    id: string;
    name: string;
    isBlock: boolean;
    subjects: {
      id: string;
      lmsId: number;
      type: SubjectType;
      name: string;
      unitsNumber: number;
      image: string | null;
      progress: number;
      teacher: {
        name: string | undefined;
        surname1: string | null | undefined;
        surname2: string | null | undefined;
        id: string | undefined;
        avatar: string | null | undefined;
      } | null;
    }[];
  }[];
}

export class GetStudentAcademicRecordResponse {
  static create(
    academicRecord: AcademicRecord,
  ): GetStudentAcademicRecordResponseBody {
    const blocks = academicRecord.academicProgram.programBlocks.map(
      (programBlock: ProgramBlock) => {
        return {
          id: programBlock.id,
          name: programBlock.name,
          isBlock: programBlock.subjects.length === 0,
          subjects: programBlock.subjects.map((subject: Subject) => {
            return {
              id: subject.id,
              lmsId: subject.lmsCourse?.value?.id ?? 0,
              name: subject.name,
              type: subject.type,
              image: subject.image,
              unitsNumber: subject.lmsCourse?.value?.modules?.length ?? 0,
              progress: subject.lmsCourse?.value.progress ?? 0,
              teacher: {
                id: subject.defaultTeacher?.id,
                name: subject.defaultTeacher?.name,
                surname1: subject.defaultTeacher?.surname1,
                surname2: subject.defaultTeacher?.surname2,
                avatar: subject.defaultTeacher?.avatar,
              },
            };
          }),
        };
      },
    );

    return {
      id: academicRecord.id,
      blocks,
    };
  }
}
