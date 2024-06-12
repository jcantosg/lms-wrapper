import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { TransferAcademicRecordE2eSeed } from '#test/e2e/sga/student/academic-record/transfer-academic-record.e2e-seed';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { academicRecordSchema } from '#student/infrastructure/config/schema/academic-record.schema';
import { academicRecordTransferSchema } from '#student/infrastructure/config/schema/academic-record-transfer.schema';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';

describe('/academic-record/:id/transfer (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  const path = `/academic-record/${TransferAcademicRecordE2eSeed.oldAcademicRecordId}/transfer`;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new TransferAcademicRecordE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      TransferAcademicRecordE2eSeed.superAdminUserEmail,
      TransferAcademicRecordE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      TransferAcademicRecordE2eSeed.adminUserEmail,
      TransferAcademicRecordE2eSeed.adminUserPassword,
    );
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

  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should return 404 for academic record not found', async () => {
    const response = await supertest(httpServer)
      .put(`/academic-record/76970b79-4888-4190-9d65-e68d48709149/transfer`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .field(
        'academicRecordId',
        TransferAcademicRecordE2eSeed.newAcademicRecordId,
      )
      .field('businessUnitId', TransferAcademicRecordE2eSeed.businessUnitId)
      .field('virtualCampusId', TransferAcademicRecordE2eSeed.virtualCampusId)
      .field('academicPeriodId', TransferAcademicRecordE2eSeed.academicPeriodId)
      .field(
        'academicProgramId',
        TransferAcademicRecordE2eSeed.academicProgramId,
      )
      .field('modality', AcademicRecordModalityEnum.ELEARNING)
      .field('isModular', false)
      .expect(404);

    expect(response.body.message).toEqual('sga.academic-record.not-found');
  });

  it('should return 404 for business unit not found', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .field(
        'academicRecordId',
        TransferAcademicRecordE2eSeed.newAcademicRecordId,
      )
      .field('businessUnitId', '76970b79-4888-4190-9d65-e68d48709149')
      .field('virtualCampusId', TransferAcademicRecordE2eSeed.virtualCampusId)
      .field('academicPeriodId', TransferAcademicRecordE2eSeed.academicPeriodId)
      .field(
        'academicProgramId',
        TransferAcademicRecordE2eSeed.academicProgramId,
      )
      .field('modality', AcademicRecordModalityEnum.ELEARNING)
      .field('isModular', false)
      .expect(404);

    expect(response.body.message).toEqual('sga.business-unit.not-found');
  });

  it('should return 404 for virtual campus not found', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .field(
        'academicRecordId',
        TransferAcademicRecordE2eSeed.newAcademicRecordId,
      )
      .field('virtualCampusId', '76970b79-4888-4190-9d65-e68d48709149')
      .field('businessUnitId', TransferAcademicRecordE2eSeed.businessUnitId)
      .field('academicPeriodId', TransferAcademicRecordE2eSeed.academicPeriodId)
      .field(
        'academicProgramId',
        TransferAcademicRecordE2eSeed.academicProgramId,
      )
      .field('modality', AcademicRecordModalityEnum.ELEARNING)
      .field('isModular', false)
      .expect(404);

    expect(response.body.message).toEqual('sga.virtual-campus.not-found');
  });

  it('should return 404 for academic period not found', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .field(
        'academicRecordId',
        TransferAcademicRecordE2eSeed.newAcademicRecordId,
      )
      .field('virtualCampusId', TransferAcademicRecordE2eSeed.virtualCampusId)
      .field('businessUnitId', TransferAcademicRecordE2eSeed.businessUnitId)
      .field('academicPeriodId', '76970b79-4888-4190-9d65-e68d48709149')
      .field(
        'academicProgramId',
        TransferAcademicRecordE2eSeed.academicProgramId,
      )
      .field('modality', AcademicRecordModalityEnum.ELEARNING)
      .field('isModular', false)
      .expect(404);

    expect(response.body.message).toEqual('sga.academic-period.not-found');
  });

  it('should return 404 for academic program not found', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .field(
        'academicRecordId',
        TransferAcademicRecordE2eSeed.newAcademicRecordId,
      )
      .field('virtualCampusId', TransferAcademicRecordE2eSeed.virtualCampusId)
      .field('businessUnitId', TransferAcademicRecordE2eSeed.businessUnitId)
      .field('academicPeriodId', TransferAcademicRecordE2eSeed.academicPeriodId)
      .field('academicProgramId', '76970b79-4888-4190-9d65-e68d48709149')
      .field('modality', AcademicRecordModalityEnum.ELEARNING)
      .field('isModular', false)
      .expect(404);

    expect(response.body.message).toEqual('sga.academic-program.not-found');
  });

  it('should return 409 for academic program not included in academic period', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .field(
        'academicRecordId',
        TransferAcademicRecordE2eSeed.newAcademicRecordId,
      )
      .field('virtualCampusId', TransferAcademicRecordE2eSeed.virtualCampusId)
      .field('businessUnitId', TransferAcademicRecordE2eSeed.businessUnitId)
      .field('academicPeriodId', TransferAcademicRecordE2eSeed.academicPeriodId)
      .field(
        'academicProgramId',
        TransferAcademicRecordE2eSeed.notIncludedAcademicProgramId,
      )
      .field('modality', AcademicRecordModalityEnum.ELEARNING)
      .field('isModular', false)
      .expect(409);

    expect(response.body.message).toEqual(
      'sga.academic-program.not-included-in-academic-period',
    );
  });

  it('should transfer academic record successfully', async () => {
    const repository = datasource.getRepository(academicRecordSchema);
    const transferRepository = datasource.getRepository(
      academicRecordTransferSchema,
    );

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .field(
        'academicRecordId',
        TransferAcademicRecordE2eSeed.newAcademicRecordId,
      )
      .field('virtualCampusId', TransferAcademicRecordE2eSeed.virtualCampusId)
      .field('businessUnitId', TransferAcademicRecordE2eSeed.businessUnitId)
      .field('academicPeriodId', TransferAcademicRecordE2eSeed.academicPeriodId)
      .field(
        'academicProgramId',
        TransferAcademicRecordE2eSeed.academicProgramId,
      )
      .field('modality', AcademicRecordModalityEnum.ELEARNING)
      .field('isModular', false)
      .expect(200);

    const oldAcademicRecord = await repository.findOne({
      where: { id: TransferAcademicRecordE2eSeed.oldAcademicRecordId },
    });
    expect(oldAcademicRecord!.status).toEqual(
      AcademicRecordStatusEnum.CANCELLED,
    );

    const newAcademicRecord = await repository.findOne({
      where: { id: TransferAcademicRecordE2eSeed.newAcademicRecordId },
    });
    expect(newAcademicRecord).toBeDefined();
    expect(newAcademicRecord).not.toBeNull();

    const academicRecordTransfer = await transferRepository.findOne({
      where: {
        oldAcademicRecord: {
          id: TransferAcademicRecordE2eSeed.oldAcademicRecordId,
        },
        newAcademicRecord: {
          id: TransferAcademicRecordE2eSeed.newAcademicRecordId,
        },
      },
    });
    expect(academicRecordTransfer).toBeDefined();
    expect(academicRecordTransfer).not.toBeNull();
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
