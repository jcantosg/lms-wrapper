import { CommandHandler } from '#shared/domain/bus/command.handler';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { EvaluationTypeGetter } from '#academic-offering/domain/service/examination-type/evaluation-type-getter.service';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { SubjectDuplicatedException } from '#shared/domain/exception/academic-offering/subject.duplicated.exception';
import { SubjectDuplicatedCodeException } from '#shared/domain/exception/academic-offering/subject.duplicated-code.exception';
import { CreateSubjectCommand } from '#academic-offering/applicaton/subject/create-subject/create-subject.command';
import { GetLmsCourseHandler } from '#/lms-wrapper/application/lms-course/get-lms-course/get-lms-course.handler';
import { GetLMSCourseQuery } from '#/lms-wrapper/application/lms-course/get-lms-course/get-lms-course.query';
import { CreateLmsCourseHandler } from '#/lms-wrapper/application/lms-course/create-lms-course/create-lms-course.handler';
import { CreateLmsCourseCommand } from '#/lms-wrapper/application/lms-course/create-lms-course/create-lms-course.command';
import { getLmsCourseCategoryEnumValue } from '#/lms-wrapper/domain/enum/lms-course-category.enum';
import { GetLmsCourseByNameHandler } from '#/lms-wrapper/application/lms-course/get-lms-course-by-name/get-lms-course-by-name.handler';
import { GetLMSCourseByNameQuery } from '#/lms-wrapper/application/lms-course/get-lms-course-by-name/get-lms-course-by-name.query';

export class CreateSubjectHandler implements CommandHandler {
  constructor(
    private readonly repository: SubjectRepository,
    private readonly evaluationTypeGetter: EvaluationTypeGetter,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly imageUploader: ImageUploader,
    private readonly getLMSCourseHandler: GetLmsCourseHandler,
    private readonly createLMSCourseHandler: CreateLmsCourseHandler,
    private readonly getLMSCourseByNameHandler: GetLmsCourseByNameHandler,
  ) {}

  async handle(command: CreateSubjectCommand): Promise<void> {
    if (await this.repository.exists(command.id)) {
      throw new SubjectDuplicatedException();
    }
    if (await this.repository.existsByCode(command.id, command.code)) {
      throw new SubjectDuplicatedCodeException();
    }
    const adminUserBusinessUnitsId = command.adminUser.businessUnits.map(
      (bu: BusinessUnit) => bu.id,
    );
    const businessUnit = await this.businessUnitGetter.getByAdminUser(
      command.businessUnitId,
      adminUserBusinessUnitsId,
    );
    const evaluationType = command.evaluationTypeId
      ? await this.evaluationTypeGetter.get(command.evaluationTypeId)
      : null;

    const image = command.image
      ? await this.imageUploader.uploadImage(
          command.image,
          command.name,
          'subject',
        )
      : null;

    const subject = Subject.create(
      command.id,
      image,
      command.name,
      command.code,
      command.officialCode,
      command.hours,
      command.modality,
      evaluationType,
      command.type,
      businessUnit,
      command.isRegulated,
      command.isCore,
      command.adminUser,
      command.officialRegionalCode,
    );
    let lmsCourse;
    if (command.lmsCourseId) {
      lmsCourse = await this.getLMSCourseHandler.handle(
        new GetLMSCourseQuery(command.lmsCourseId),
      );
    } else {
      await this.createLMSCourseHandler.handle(
        new CreateLmsCourseCommand(
          command.name,
          command.code,
          getLmsCourseCategoryEnumValue(this.parseModality(command.modality)),
        ),
      );
      lmsCourse = await this.getLMSCourseByNameHandler.handle(
        new GetLMSCourseByNameQuery(command.name),
      );
    }
    subject.addLmsCourse(lmsCourse);
    await this.repository.save(subject);
  }

  private parseModality(modality: string): string {
    return modality.replace('-', '_').toUpperCase();
  }
}
