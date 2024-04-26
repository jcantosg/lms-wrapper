import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { Student } from '#/student/domain/entity/student.entity';
import { StudentRepository } from '#/student/domain/repository/student.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { studentSchema } from '#/student/infrastructure/config/schema/student.schema';
import { Repository } from 'typeorm';

export class StudentPostgresRepository
  extends TypeOrmRepository<Student>
  implements StudentRepository
{
  constructor(
    @InjectRepository(studentSchema) private repository: Repository<Student>,
  ) {
    super();
  }

  async save(student: Student): Promise<void> {
    await this.repository.save({
      id: student.id,
      name: student.name,
      surname: student.surname,
      surname2: student.surname2,
      email: student.email,
      universaeEmail: student.universaeEmail,
      avatar: student.avatar,
      birthDate: student.birthDate,
      gender: student.gender,
      country: student.country,
      citizenship: student.citizenship,
      identityDocument: student.identityDocument,
      socialSecurityNumber: student.socialSecurityNumber,
      status: student.status,
      isActive: student.isActive,
      origin: student.origin,
      crmId: student.crmId,
      accessQualification: student.accessQualification,
      niaIdalu: student.niaIdalu,
      phone: student.phone,
      contactCountry: student.contactCountry,
      state: student.state,
      city: student.city,
      address: student.address,
      guardianName: student.guardianName,
      guardianSurnam: student.guardianSurname,
      guardianEmail: student.guardianEmail,
      guardianPhone: student.guardianPhone,
      createdBy: student.createdBy,
      updatedBy: student.updatedBy,
    });
  }

  async existsById(id: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { id: id } });

    return !!result;
  }

  async existsByEmail(id: string, email: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { email: email } });

    return result === null ? false : result.id !== id;
  }

  async existsByUniversaeEmail(
    id: string,
    universaeEmail: string,
  ): Promise<boolean> {
    const result = await this.repository.findOne({
      where: { universaeEmail: universaeEmail },
    });

    return result === null ? false : result.id !== id;
  }

  async get(id: string): Promise<Student | null> {
    return await this.repository.findOne({ where: { id: id } });
  }
}
