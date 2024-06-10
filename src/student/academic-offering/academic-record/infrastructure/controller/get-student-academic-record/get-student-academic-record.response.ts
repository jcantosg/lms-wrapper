import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';

interface GetStudentAcademicRecordResponseBody {
  id: string;
  blocks: {
    id: string;
    name: string;
    isBlock: boolean;
    subjects: {
      id: string;
      lmsId: number;
      name: string;
      unitsNumber: number;
      image: string | null;
      teacher: {
        name: string | undefined;
        id: string | undefined;
        avatar: string | null | undefined;
      };
    }[];
  }[];
}

export class GetStudentAcademicRecordResponse {
  static create(
    academicRecord: AcademicRecord,
  ): GetStudentAcademicRecordResponseBody {
    return {
      id: academicRecord.id,
      blocks: academicRecord.academicProgram.programBlocks.map(
        (programBlock: ProgramBlock) => {
          return {
            id: programBlock.id,
            name: programBlock.name,
            isBlock:
              programBlock.blockRelation!.periodBlock.startDate <= new Date(),
            subjects: programBlock.subjects.map((subject: Subject) => {
              return {
                id: subject.id,
                lmsId: subject.lmsCourse!.value.id,
                name: subject.name,
                image: subject.image,
                unitsNumber: subject.lmsCourse!.value.modules.length,
                teacher: {
                  id: subject.defaultTeacher?.id,
                  name: subject.defaultTeacher?.name,
                  avatar: subject.defaultTeacher?.avatar,
                },
              };
            }),
          };
        },
      ),
    };
  }
}
