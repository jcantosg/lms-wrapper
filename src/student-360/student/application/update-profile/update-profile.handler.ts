import { CommandHandler } from '#shared/domain/bus/command.handler';
import { StudentRepository } from '#shared/domain/repository/student.repository';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { StudentDuplicatedEmailException } from '#student/shared/exception/student-duplicated-email.exception';
import { UpdateProfileCommand } from '#student-360/student/application/update-profile/update-profile.command';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { StudentPasswordChecker } from '#student-360/student/domain/service/student-password-checker.service';
import { UnauthorizedException } from '@nestjs/common';

export class UpdateProfileHandler implements CommandHandler {
  constructor(
    private readonly repository: StudentRepository,
    private readonly studentGetter: StudentGetter,
    private readonly countryGetter: CountryGetter,
    private readonly imageUploader: ImageUploader,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly passwordChecker: StudentPasswordChecker,
  ) {}

  async handle(command: UpdateProfileCommand): Promise<void> {
    if (await this.repository.existsByEmail(command.id, command.email)) {
      throw new StudentDuplicatedEmailException();
    }
    const student = await this.studentGetter.get(command.id);
    if (
      command.oldPassword &&
      !(await this.passwordChecker.checkPassword(command.oldPassword, student))
    ) {
      throw new UnauthorizedException();
    }
    const newAvatar = command.avatar
      ? await this.imageUploader.uploadImage(
          command.avatar,
          command.name,
          'student-avatar',
        )
      : student.avatar;
    const newCountry = command.country
      ? await this.countryGetter.get(command.country)
      : student.country;
    const newCitizenship = command.citizenship
      ? await this.countryGetter.get(command.citizenship)
      : student.citizenship;
    const newContactCountry = command.contactCountry
      ? await this.countryGetter.get(command.contactCountry)
      : null;

    const password = command.newPassword
      ? await this.passwordEncoder.encodePassword(command.newPassword)
      : student.password;
    student.updateProfile(
      command.name,
      command.surname,
      command.surname2,
      command.email,
      password,
      newAvatar,
      command.birthDate,
      command.gender,
      newCountry,
      newCitizenship,
      command.socialSecurityNumber,
      command.phone,
      newContactCountry,
      command.state,
      command.city,
      command.address,
      command.guardianName,
      command.guardianSurname,
      command.guardianEmail,
      command.guardianPhone,
    );
    student.updated();

    await this.repository.save(student);
  }
}
