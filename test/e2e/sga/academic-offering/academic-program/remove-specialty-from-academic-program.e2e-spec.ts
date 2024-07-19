import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { RemoveSpecialtyfromAcademicProgramE2eSeed } from '#test/e2e/sga/academic-offering/academic-program/remove-specialty-from-academic-program.e2e-seeds';

const path = `/academic-program/${RemoveSpecialtyfromAcademicProgramE2eSeed.academicProgramId}/remove-specialty`;
const wrongPath = `/academic-program/b595ba58-4e47-4ec6-9001-e236f9b28ea7/remove-specialty`;

describe('/academic-program/id/remove-specialty (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new RemoveSpecialtyfromAcademicProgramE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        RemoveSpecialtyfromAcademicProgramE2eSeed.superAdminUserEmail,
        RemoveSpecialtyfromAcademicProgramE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        RemoveSpecialtyfromAcademicProgramE2eSeed.adminUserEmail,
        RemoveSpecialtyfromAcademicProgramE2eSeed.adminUserPassword,
      ),
    ]);
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });
  it('should return forbidden', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessToken, { type: 'bearer' });
  });
  it('should throw a bad request exception', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });
  it('should throw AcademicProgramNotFoundException', async () => {
    const response = await supertest(httpServer)
      .put(wrongPath)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectId: RemoveSpecialtyfromAcademicProgramE2eSeed.subjectId,
      })
      .expect(404);
    expect(response.body.message).toEqual('sga.academic-program.not-found');
  });
  it('should throw SubjectNotFoundException', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectId: 'b595ba58-4e47-4ec6-9001-e236f9b28ea7',
      })
      .expect(404);
    expect(response.body.message).toEqual('sga.subject.not-found');
  });
  it('should throw a InvalidSubjectTypeException', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectId: RemoveSpecialtyfromAcademicProgramE2eSeed.subjectId,
      })
      .expect(409);
    expect(response.body.message).toEqual('sga.subject.invalid-type');
  });
  it('should throw a SubjectHasEnrollmentsException', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectId:
          RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyWithEnrollmentId,
      })
      .expect(409);
    expect(response.body.message).toEqual('sga.subject.has-enrollments');
  });

  it('should remove a specialty from academic program', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectId: RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyId,
      })
      .expect(200);

    const repository = datasource.getRepository(programBlockSchema);
    const programBlock = await repository.findOne({
      where: { id: RemoveSpecialtyfromAcademicProgramE2eSeed.programBlockId },
      relations: { subjects: true },
    });
    expect(programBlock!.subjects).toEqual(
      expect.arrayContaining([
        expect.not.objectContaining({
          _id: RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyId,
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
