import { HttpServer, INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { EditVirtualCampusE2eSeed } from '#test/e2e/sga/business-unit/edit-virtual-campus.e2e-seed';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { VirtualCampusPostgresRepository } from '#business-unit/infrastructure/repository/virtual-campus.postgres-repository';
import { virtualCampusSchema } from '#business-unit/infrastructure/config/schema/virtual-campus.schema';

const path = '/virtual-campus/1847be5e-693f-4a7d-9f66-00faed159c0c';

describe('/virtual-campus/:id (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;
  let virtualCampusRepository: VirtualCampusRepository;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new EditVirtualCampusE2eSeed(datasource);
    await seeder.arrange();
    adminAccessToken = await login(
      httpServer,
      EditVirtualCampusE2eSeed.adminUserEmail,
      EditVirtualCampusE2eSeed.adminUserPassword,
    );
    superAdminAccessToken = await login(
      httpServer,
      EditVirtualCampusE2eSeed.superAdminUserEmail,
      EditVirtualCampusE2eSeed.superAdminUserPassword,
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

  it('should return 404 when virtual campus does not exist', async () => {
    await supertest(httpServer)
      .put('/virtual-campus/ce3e994a-0bd0-4911-a0ec-48429a709284')
      .send({
        name: 'TestBusinessUnit',
        code: 'TestBusinessCode',
        isActive: false,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);
  });

  it('should return bad request when empty body', async () => {
    await supertest(httpServer)
      .put(path)
      .send({})
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should edit the virtual campus', async () => {
    virtualCampusRepository = new VirtualCampusPostgresRepository(
      datasource.getRepository(virtualCampusSchema),
    );

    await supertest(httpServer)
      .put(path)
      .send({
        name: 'TestVirtualCampusUnit',
        code: 'TestVirtualCampusCode',
        isActive: false,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const virtualCampus = await virtualCampusRepository.get(
      '1847be5e-693f-4a7d-9f66-00faed159c0c',
    );

    expect(virtualCampus?.name).toEqual('TestVirtualCampusUnit');
    expect(virtualCampus?.code).toEqual('TestVirtualCampusCode');
    expect(virtualCampus?.isActive).toEqual(false);
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
