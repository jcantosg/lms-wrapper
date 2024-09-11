import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { StudentPasswordUpdatedEvent } from '#student/domain/event/student/student-password-updated.event';
import { OnEvent } from '@nestjs/event-emitter';
import {
  parseAddress,
  parseEmail,
} from '#shared/domain/lib/business-unit-info-parser';

@Injectable()
export class StudentUpdatePasswordListener {
  constructor(private readonly mailer: MailerService) {}

  @OnEvent('student-password-updated')
  async sendCredentials(payload: StudentPasswordUpdatedEvent) {
    const student = payload.student;
    const newAcademicRecord = student.academicRecords[0];
    if (!newAcademicRecord) {
      return;
    }
    this.mailer.sendMail({
      to: student.email,
      template: './new-student-credentials',
      subject: '',
      context: {
        studentName: student.name,
        universaeEmail: student.universaeEmail,
        password: payload.newPassword,
        businessUnitEmail: parseEmail(newAcademicRecord.businessUnit),
        businessUnitAddress: parseAddress(newAcademicRecord.businessUnit),
      },
    });
  }
}
