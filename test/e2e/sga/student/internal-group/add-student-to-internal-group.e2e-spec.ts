import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { Repository } from 'typeorm';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { AddInternalGroupToAcademicPeriodE2eSeed } from '#test/e2e/sga/student/internal-group/add-internal-group-to-academic-period.e2e-seed';
import { internalGroupSchema } from '#student/infrastructure/config/schema/internal-group.schema';
import { GetAllInternalGroupsE2eSeed } from '#test/e2e/sga/student/internal-group/get-all-internal-groups.e2e-seed';
import { Student } from '#shared/domain/entity/student.entity';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';

const path = `/internal-group/${GetAllInternalGroupsE2eSeed.internalGroupId}/add-student`;

describe('/internal-group/{id}/add-student (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  let internalGroupRepository: Repository<InternalGroup>;
  let studentRepository: Repository<Student>;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetAllInternalGroupsE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        AddInternalGroupToAcademicPeriodE2eSeed.superAdminUserEmail,
        AddInternalGroupToAcademicPeriodE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        AddInternalGroupToAcademicPeriodE2eSeed.adminUserEmail,
        AddInternalGroupToAcademicPeriodE2eSeed.adminUserPassword,
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

  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should return 404 internal group not found', async () => {
    const response = await supertest(httpServer)
      .put('/internal-group/4bc9cbfc-decf-4546-b4ac-483a93b8a33f/add-student')
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        studentIds: ['4bc9cbfc-decf-4546-b4ac-483a93b8a33f'],
      })
      .expect(404);

    expect(response.body.message).toEqual('sga.internal-group.not-found');
  });

  it('should return 404 edae user not found', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        studentIds: ['4bc9cbfc-daaf-4546-b4ac-483222b8a33f'],
      })
      .expect(404);

    expect(response.body.message).toEqual('sga.student.not-found');
  });

  it('should add a student to the internal group', async () => {
    internalGroupRepository = datasource.getRepository(internalGroupSchema);
    studentRepository = datasource.getRepository(studentSchema);

    const student = await studentRepository.findOne({
      where: { id: GetAllInternalGroupsE2eSeed.studentId },
    });

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        studentIds: [GetAllInternalGroupsE2eSeed.studentId],
      })
      .expect(200);

    const internalGroup = await internalGroupRepository.findOne({
      where: {
        id: GetAllInternalGroupsE2eSeed.internalGroupId,
      },
      relations: { students: true },
    });

    expect(internalGroup!.students.map((student) => student.id)).toContain(
      student!.id,
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
