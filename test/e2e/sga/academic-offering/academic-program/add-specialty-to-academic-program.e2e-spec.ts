import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { AddSpecialtyToAcademicProgramE2eSeed } from '#test/e2e/sga/academic-offering/academic-program/add-specialty-to-academic-program.e2e-seeds';

const path = `/academic-program/${AddSpecialtyToAcademicProgramE2eSeed.academicProgramId}/add-specialty`;

describe('/academic-program/id/add-specialty (POST)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new AddSpecialtyToAcademicProgramE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        AddSpecialtyToAcademicProgramE2eSeed.superAdminUserEmail,
        AddSpecialtyToAcademicProgramE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        AddSpecialtyToAcademicProgramE2eSeed.adminUserEmail,
        AddSpecialtyToAcademicProgramE2eSeed.adminUserPassword,
      ),
    ]);
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });
  it('should return forbidden', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });
  it('should throw bad request', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should throw a AcademicProgram Not Found Exception', async () => {
    const response = await supertest(httpServer)
      .put(
        '/academic-program/d97ec108-5c63-44be-93d1-59c48e64c24b/add-specialty',
      )
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({ subjectId: AddSpecialtyToAcademicProgramE2eSeed.specialtyId })
      .expect(404);
    expect(response.body.message).toBe('sga.academic-program.not-found');
  });

  it('should throw a Subject Not Found Exception', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({ subjectId: 'd97ec108-5c63-44be-93d1-59c48e64c24b' })
      .expect(404);
    expect(response.body.message).toBe('sga.subject.not-found');
  });

  it('should throw a Invalid Subject Type Not Found Exception', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({ subjectId: AddSpecialtyToAcademicProgramE2eSeed.subjectId })
      .expect(409);
    expect(response.body.message).toBe('sga.subject.invalid-type');
  });

  it('should throw a Academic Program Missmatch Business Unit Exception', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectId: AddSpecialtyToAcademicProgramE2eSeed.otherSpecialtyId,
      })
      .expect(409);
    expect(response.body.message).toBe(
      'sga.academic-program.missmatch-business-unit',
    );
  });

  it('should add a specialty to an academic program', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({ subjectId: AddSpecialtyToAcademicProgramE2eSeed.specialtyId })
      .expect(200);

    const programBlock = await datasource
      .getRepository(programBlockSchema)
      .findOne({
        where: { id: AddSpecialtyToAcademicProgramE2eSeed.programBlockId },
        relations: { subjects: true },
      });

    expect(programBlock!.subjects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: AddSpecialtyToAcademicProgramE2eSeed.specialtyId,
          _type: AddSpecialtyToAcademicProgramE2eSeed.specialtyType,
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
