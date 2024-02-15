import { getAnAdminUser, getAnExaminationCenter } from '#test/entity-factory';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import { v4 as uuid } from 'uuid';
import { ClassroomWrongCapacityException } from '#shared/domain/exception/business-unit/classroom/classroom-wrong-capacity.exception';

const examinationCenter = getAnExaminationCenter();
const adminUser = getAnAdminUser();

describe('Classroom Creation', () => {
  it('should create a classroom', () => {
    const classroom = Classroom.create(
      uuid(),
      'CODE',
      'name',
      4,
      adminUser,
      examinationCenter,
    );
    expect(classroom.code).toEqual('CODE');
  });
  it('should throw a ClassroomWrongCapacityException', () => {
    expect(() => {
      Classroom.create(
        uuid(),
        'CODE',
        'name',
        -1,
        adminUser,
        examinationCenter,
      );
    }).toThrow(ClassroomWrongCapacityException);
  });

  it('should throw a ClassroomWrongCapacityException when edit', () => {
    const classroom = Classroom.create(
      uuid(),
      'CODE',
      'name',
      4,
      adminUser,
      examinationCenter,
    );

    expect(() => {
      classroom.update('name', 'CODE', -1, adminUser);
    }).toThrow(ClassroomWrongCapacityException);
  });

  it('should edit a classroom', () => {
    const classroom = Classroom.create(
      uuid(),
      'CODE',
      'name',
      4,
      adminUser,
      examinationCenter,
    );

    classroom.update('name', 'CODETEST', 5, adminUser);

    expect(classroom.code).toEqual('CODETEST');
  });
});
