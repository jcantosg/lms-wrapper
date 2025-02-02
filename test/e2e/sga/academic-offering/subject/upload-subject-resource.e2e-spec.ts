import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { UploadSubjectResourceE2eSeed } from '#test/e2e/sga/academic-offering/subject/upload-subject-resource.e2e-seeds';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { subjectResourceSchema } from '#academic-offering/infrastructure/config/schema/subject-resource.schema';

const path = `/subject/${UploadSubjectResourceE2eSeed.subjectId}/resource`;
const wrongPath = '/subject/2e06ca71-8b93-4613-9f24-30406f37c0de/resource';

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
    seeder = new UploadSubjectResourceE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        UploadSubjectResourceE2eSeed.superAdminUserEmail,
        UploadSubjectResourceE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        UploadSubjectResourceE2eSeed.adminUserEmail,
        UploadSubjectResourceE2eSeed.adminUserPassword,
      ),
    ]);
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).post(path).expect(401);
  });
  it('should return forbidden', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });
  it('should upload a subject resource', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .field('ids[]', UploadSubjectResourceE2eSeed.subjectResourceId)
      .attach('files', `test/universae.jpeg`)
      .expect(201);

    const subjectResource = await subjectResourceRepository.findOne({
      where: { id: UploadSubjectResourceE2eSeed.subjectResourceId },
    });
    expect(subjectResource).not.toBeNull();
  });

  it('should throw a subject not found', async () => {
    await supertest(httpServer)
      .post(wrongPath)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .field('ids[]', '62c67162-93f0-4a23-bf5e-73d27d2e6b6e')
      .attach('files', `test/universae.jpeg`)
      .expect(404);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
