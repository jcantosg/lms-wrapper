import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { DeleteSubjectResourceE2eSeed } from '#test/e2e/sga/academic-offering/subject/delete-subject-resource.e2e-seeds';
import { subjectResourceSchema } from '#academic-offering/infrastructure/config/schema/subject-resource.schema';

const path = `/subject/${DeleteSubjectResourceE2eSeed.subjectId}/resource/${DeleteSubjectResourceE2eSeed.subjectResourceId}`;
const wrongSubjectPath = `/subject/2e06ca71-8b93-4613-9f24-30406f37c0de/resource/${DeleteSubjectResourceE2eSeed.subjectResourceId}`;
const wrongSubjectResourcePath = `/subject/${DeleteSubjectResourceE2eSeed.subjectId}/resource/2e06ca71-8b93-4613-9f24-30406f37c0de`;

describe('/subject/:id/resource', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  const subjectResourceRepository = datasource.getRepository(
    subjectResourceSchema,
  );

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new DeleteSubjectResourceE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        DeleteSubjectResourceE2eSeed.superAdminUserEmail,
        DeleteSubjectResourceE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        DeleteSubjectResourceE2eSeed.adminUserEmail,
        DeleteSubjectResourceE2eSeed.adminUserPassword,
      ),
    ]);
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).delete(path).expect(401);
  });
  it('should return forbidden', async () => {
    await supertest(httpServer)
      .delete(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should throw a subject not found', async () => {
    await supertest(httpServer)
      .delete(wrongSubjectPath)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);
  });

  it('should throw a subject resource not found', async () => {
    await supertest(httpServer)
      .delete(wrongSubjectResourcePath)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);
  });

  it('should upload a subject resource', async () => {
    await supertest(httpServer)
      .delete(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const subjectResource = await subjectResourceRepository.findOne({
      where: { id: DeleteSubjectResourceE2eSeed.subjectResourceId },
    });
    expect(subjectResource).toBeNull();
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
