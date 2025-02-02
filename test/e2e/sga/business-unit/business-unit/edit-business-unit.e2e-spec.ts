import { HttpServer } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { BusinessUnitPostgresRepository } from '#business-unit/infrastructure/repository/business-unit.postgres-repository';
import { EditBusinessUnitE2eSeed } from '#test/e2e/sga/business-unit/business-unit/edit-business-unit.e2e-seeds';

const path = '/business-unit/dda38bd6-5d7e-4d85-a8c2-6d130dac9f4b';

describe('/business-unit/:id (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let businessRepository: BusinessUnitRepository;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new EditBusinessUnitE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      EditBusinessUnitE2eSeed.superAdminUserEmail,
      EditBusinessUnitE2eSeed.superAdminUserPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });

  it('should edit the business unit', async () => {
    businessRepository = new BusinessUnitPostgresRepository(
      datasource.getRepository(businessUnitSchema),
    );
    await supertest(httpServer)
      .put(path)
      .send({
        name: 'TestBusinessUnit',
        code: 'TestBusinessCode',
        countryId: EditBusinessUnitE2eSeed.secondCountryId,
        isActive: false,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);
    const businessUnit = await businessRepository.get(
      'dda38bd6-5d7e-4d85-a8c2-6d130dac9f4b',
    );

    expect(businessUnit?.name).toEqual('TestBusinessUnit');
    expect(businessUnit?.isActive).toBeFalsy();
    expect(businessUnit?.country.id).toEqual(
      EditBusinessUnitE2eSeed.secondCountryId,
    );
    expect(businessUnit?.virtualCampuses[0].isActive).toEqual(false);
  });
  it('should return bad request when empty body', async () => {
    await supertest(httpServer)
      .put(path)
      .send({})
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });
  it('should throw a BusinessUnitDuplicatedException (409)', async () => {
    await supertest(httpServer)
      .put(path)
      .send({
        name: EditBusinessUnitE2eSeed.secondBusinessUnitName,
        code: EditBusinessUnitE2eSeed.secondBusinessUnitCode,
        countryId: EditBusinessUnitE2eSeed.countryId,
        isActive: true,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(409);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
