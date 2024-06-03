import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { EditTitleE2eSeed } from '#test/e2e/sga/academic-offering/title/edit-title.e2e-seed';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { TitlePostgresRepository } from '#academic-offering/infrastructure/repository/title.postgres-repository';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';

const path = `/title/${EditTitleE2eSeed.titleId}`;

describe('/title/:id (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let gestor360AccessToken: string;
  let secretariaAccessToken: string;
  let titleRepository: TitleRepository;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new EditTitleE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, gestor360AccessToken, secretariaAccessToken] =
      await Promise.all([
        login(
          httpServer,
          EditTitleE2eSeed.superAdminUserEmail,
          EditTitleE2eSeed.superAdminUserPassword,
        ),
        login(
          httpServer,
          EditTitleE2eSeed.adminUserGestor360Email,
          EditTitleE2eSeed.adminUserGestor360Password,
        ),
        login(
          httpServer,
          EditTitleE2eSeed.adminUserSecretariaEmail,
          EditTitleE2eSeed.adminUserSecretariaPassword,
        ),
      ]);
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });

  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(secretariaAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return 404 when title not in business units requester', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(gestor360AccessToken, { type: 'bearer' })
      .send({
        name: 'new name',
        officialCode: 'new code',
        officialTitle: 'new title',
        officialProgram: 'new program',
        businessUnit: EditTitleE2eSeed.businessUnitId,
      })
      .expect(404);

    expect(response.body.message).toBe('sga.title.not-found');
  });

  it('should return 404 when business unit (in body) not in business units requester', async () => {
    const response = await supertest(httpServer)
      .put(`/title/${EditTitleE2eSeed.secondTitleId}`)
      .auth(gestor360AccessToken, { type: 'bearer' })
      .send({
        name: 'new name',
        officialCode: 'new code',
        officialTitle: 'new title',
        officialProgram: 'new program',
        businessUnit: EditTitleE2eSeed.businessUnitId,
      })
      .expect(404);

    expect(response.body.message).toBe('sga.business-unit.not-found');
  });

  it('should update a title', async () => {
    titleRepository = new TitlePostgresRepository(
      datasource.getRepository(titleSchema),
    );

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        name: 'new name',
        officialCode: 'new code',
        officialTitle: 'new title',
        officialProgram: 'new program',
        businessUnit: EditTitleE2eSeed.businessUnitId2,
      })
      .expect(200);

    const title = await titleRepository.get(EditTitleE2eSeed.titleId);

    expect(title?.name).toBe('new name');
    expect(title?.officialCode).toBe('new code');
    expect(title?.officialTitle).toBe('new title');
    expect(title?.officialProgram).toBe('new program');
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
