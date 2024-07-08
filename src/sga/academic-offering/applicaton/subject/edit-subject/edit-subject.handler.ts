import { CommandHandler } from '#shared/domain/bus/command.handler';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { EvaluationTypeGetter } from '#academic-offering/domain/service/examination-type/evaluation-type-getter.service';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { SubjectBusinessUnitChecker } from '#academic-offering/domain/service/subject/subject-business-unit-checker.service';
import { EvaluationTypeBusinessUnitChecker } from '#academic-offering/domain/service/examination-type/evaluation-type-business-unit-checker.service';
import { SubjectDuplicatedCodeException } from '#shared/domain/exception/academic-offering/subject.duplicated-code.exception';
import { EditSubjectCommand } from '#academic-offering/applicaton/subject/edit-subject/edit-subject.command';
import { GetLmsCourseHandler } from '#/lms-wrapper/application/lms-course/get-lms-course/get-lms-course.handler';
import { GetLMSCourseQuery } from '#/lms-wrapper/application/lms-course/get-lms-course/get-lms-course.query';

export class EditSubjectHandler implements CommandHandler {
  constructor(
    private readonly repository: SubjectRepository,
    private readonly subjectGetter: SubjectGetter,
    private readonly evaluationTypeGetter: EvaluationTypeGetter,
    private readonly imageUploader: ImageUploader,
    private readonly evaluationTypeBusinessUnitChecker: EvaluationTypeBusinessUnitChecker,
    private readonly subjectBusinessUnitChecker: SubjectBusinessUnitChecker,
    private readonly lmsCourseHandler: GetLmsCourseHandler,
  ) {}

  async handle(command: EditSubjectCommand): Promise<void> {
    if (await this.repository.existsByCode(command.id, command.code)) {
      throw new SubjectDuplicatedCodeException();
    }
    const evaluationType = command.evaluationType
      ? await this.evaluationTypeGetter.get(command.evaluationType)
      : null;

    this.evaluationTypeBusinessUnitChecker.checkEvaluationTypeBusinessUnit(
      evaluationType,
      command.adminUser.businessUnits,
    );
    const subject = await this.subjectGetter.get(command.id);
    this.subjectBusinessUnitChecker.checkSubjectBusinessUnit(
      subject,
      command.adminUser.businessUnits,
    );
    let image = subject.image;
    if (command.image !== undefined) {
      image = command.image
        ? await this.imageUploader.uploadImage(
            command.image,
            command.name,
            'subject',
          )
        : null;
    }
    let lmsCourse = subject.lmsCourse;
    if (command.lmsCourseId === null) {
      lmsCourse = null;
    } else if (command.lmsCourseId !== undefined) {
      lmsCourse = await this.lmsCourseHandler.handle(
        new GetLMSCourseQuery(command.lmsCourseId),
      );
    }

    subject.update(
      command.name,
      command.code,
      command.hours,
      command.officialCode,
      image,
      command.modality,
      evaluationType,
      command.type,
      command.isRegulated,
      command.isCore,
      command.adminUser,
      command.officialRegionalCode,
      lmsCourse,
    );

    await this.repository.save(subject);
  }
}
