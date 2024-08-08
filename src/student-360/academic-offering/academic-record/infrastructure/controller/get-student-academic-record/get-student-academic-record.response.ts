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
    teacher: {
      id: string;
      name: string;
      surname: string;
      surname2: string | null;
      avatar: string | null;
    } | null;
    subjects: {
      id: string;
      lmsId: number;
      type: SubjectType;
      evaluationType: string;
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
    const zeroBlock = academicRecord.academicProgram.programBlocks.find(
      (programBlock: ProgramBlock) => programBlock.name === 'Bloque 0',
    );
    const subject = zeroBlock
      ? zeroBlock.subjects.find(
          (subject: Subject) => subject.name === 'Información académica',
        )
      : null;
    const tutorTeacher = subject ? subject.defaultTeacher : null;
    const blocks = academicRecord.academicProgram.programBlocks.map(
      (programBlock: ProgramBlock) => {
        return {
          id: programBlock.id,
          name:
            programBlock.name === 'Bloque 0'
              ? 'Información'
              : programBlock.name,
          isBlock: programBlock.subjects.length === 0,
          teacher: tutorTeacher
            ? {
                id: tutorTeacher.id,
                name: tutorTeacher.name,
                surname: tutorTeacher.surname1,
                surname2: tutorTeacher.surname2,
                avatar: tutorTeacher.avatar,
              }
            : null,
          subjects: programBlock.subjects.map((subject: Subject) => {
            return {
              id: subject.id,
              lmsId: subject.lmsCourse?.value?.id ?? 0,
              name: subject.name,
              type: subject.type,
              evaluationType: subject.evaluationType!.name,
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
