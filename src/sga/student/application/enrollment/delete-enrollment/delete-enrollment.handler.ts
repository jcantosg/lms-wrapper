import { CommandHandler } from '#shared/domain/bus/command.handler';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { DeleteEnrollmentCommand } from '#student/application/enrollment/delete-enrollment/delete-enrollment.command';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { EnrollmentSubjectCallsTakenException } from '#shared/domain/exception/academic-offering/enrollment.subject-calls-taken.exception';
import { DeleteLmsEnrollmentHandler } from '#lms-wrapper/application/delete-lms-enrollment/delete-lms-enrollment.handler';
import { LmsEnrollmentNotInEnrollmentException } from '#lms-wrapper/domain/exception/lms-enrollment-not-in-enrollment.exception';
import { LmsStudentNotInStudentException } from '#lms-wrapper/domain/exception/lms-student-not-in-student.exception';
import { LmsCourseNotInSubjectException } from '#lms-wrapper/domain/exception/lms-course-not-in-subject.exception';
import { DeleteLmsEnrollmentCommand } from '#lms-wrapper/application/delete-lms-enrollment/delete-lms-enrollment.command';

export class DeleteEnrollmentHandler implements CommandHandler {
  constructor(
    private readonly enrollmentGetter: EnrollmentGetter,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly subjectCallRepository: SubjectCallRepository,
    private readonly deleteLmsEnrollmentHandler: DeleteLmsEnrollmentHandler,
  ) {}

  async handle(command: DeleteEnrollmentCommand): Promise<void> {
    const enrollment = await this.enrollmentGetter.get(command.enrollmentId);

    if (enrollment.isEnrollmentTaken()) {
      throw new EnrollmentSubjectCallsTakenException();
    }
    for (const call of enrollment.calls) {
      await this.subjectCallRepository.delete(call);
    }
    await this.enrollmentRepository.delete(enrollment);
    if (!enrollment.lmsEnrollment?.value.courseId) {
      throw new LmsEnrollmentNotInEnrollmentException();
    }
    if (!enrollment.academicRecord.student.lmsStudent?.value.id) {
      throw new LmsStudentNotInStudentException();
    }
    if (!enrollment.subject.lmsCourse?.value.id) {
      throw new LmsCourseNotInSubjectException();
    }
    await this.deleteLmsEnrollmentHandler.handle(
      new DeleteLmsEnrollmentCommand(
        enrollment.subject.lmsCourse.value.id,
        enrollment.academicRecord.student.lmsStudent.value.id,
      ),
    );
  }
}
