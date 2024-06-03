import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { EditAcademicRecordE2eSeed } from '#test/e2e/sga/student/academic-record/edit-academic-record.e2e-seed';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { academicRecordSchema } from '#student/infrastructure/config/schema/academic-record.schema';

const path = `/academic-record/${EditAcademicRecordE2eSeed.academicRecordId}`;

describe('/academic-record/:id (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessSecretariaToken: string;
  let adminAcessGestor360Token: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new EditAcademicRecordE2eSeed(datasource);
    await seeder.arrange();
    [
      superAdminAccessToken,
      adminAccessSecretariaToken,
      adminAcessGestor360Token,
    ] = await Promise.all([
      login(
        httpServer,
        EditAcademicRecordE2eSeed.superAdminUserEmail,
        EditAcademicRecordE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        EditAcademicRecordE2eSeed.adminUserSecretariaEmail,
        EditAcademicRecordE2eSeed.adminUserSecretariaPassword,
      ),
      login(
        httpServer,
        EditAcademicRecordE2eSeed.adminUserGestor360Email,
        EditAcademicRecordE2eSeed.adminUserGestor360Password,
      ),
    ]);
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessSecretariaToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should return 404 academic record not found', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(adminAcessGestor360Token, { type: 'bearer' })
      .send({
        modality: AcademicRecordModalityEnum.MIXED,
        status: AcademicRecordStatusEnum.FINISHED,
        isModular: false,
      })
      .expect(404);

    expect(response.body.message).toEqual('sga.academic-record.not-found');
  });

  it('should update an academic record', async () => {
    const repository = datasource.getRepository(academicRecordSchema);

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        modality: AcademicRecordModalityEnum.MIXED,
        status: AcademicRecordStatusEnum.FINISHED,
        isModular: false,
      })
      .expect(200);

    const academicRecord = await repository.findOne({
      where: { id: EditAcademicRecordE2eSeed.academicRecordId },
    });

    expect(academicRecord?.status).toEqual(AcademicRecordStatusEnum.FINISHED);
    expect(academicRecord?.modality).toEqual(AcademicRecordModalityEnum.MIXED);
    expect(academicRecord?.isModular).toEqual(false);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
