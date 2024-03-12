import { CommandHandler } from '#shared/domain/bus/command.handler';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { EditSubjectCommand } from '#academic-offering/applicaton/edit-subject/edit-subject.command';
import { EvaluationTypeGetter } from '#academic-offering/domain/service/evaluation-type-getter.service';
import { SubjectGetter } from '#academic-offering/domain/service/subject-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { SubjectBusinessUnitChecker } from '#academic-offering/domain/service/subject-business-unit-checker.service';
import { EvaluationTypeBusinessUnitChecker } from '#academic-offering/domain/service/evaluation-type-business-unit-checker.service';
import { SubjectDuplicatedCodeException } from '#shared/domain/exception/academic-offering/subject.duplicated-code.exception';

export class EditSubjectHandler implements CommandHandler {
  constructor(
    private readonly repository: SubjectRepository,
    private readonly subjectGetter: SubjectGetter,
    private readonly evaluationTypeGetter: EvaluationTypeGetter,
    private readonly imageUploader: ImageUploader,
    private readonly evaluationTypeBusinessUnitChecker: EvaluationTypeBusinessUnitChecker,
    private readonly subjectBusinessUnitChecker: SubjectBusinessUnitChecker,
  ) {}

  async handle(command: EditSubjectCommand): Promise<void> {
    if (await this.repository.existsByCode(command.id, command.code)) {
      throw new SubjectDuplicatedCodeException();
    }
    const evaluationType =
      command.evaluationType && command.isRegulated
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

    const image = command.image
      ? await this.imageUploader.uploadImage(
          command.image,
          command.name,
          'subjects',
        )
      : null;

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
    );

    await this.repository.save(subject);
  }
}
