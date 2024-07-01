import { DataSource } from 'typeorm';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { BCryptPasswordEncoder } from '#shared/infrastructure/service/bcrypt-password-encoder.service';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import {
  IdentityDocument,
  IdentityDocumentType,
} from '#/sga/shared/domain/value-object/identity-document';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { Country } from '#shared/domain/entity/country.entity';
import supertest from 'supertest';
import { HttpServer } from '@nestjs/common';

export async function createEdaeUser(
  datasource: DataSource,
  id: string,
  name: string,
  surname1: string,
  email: string,
  password: string,
  roles: EdaeRoles[],
  businessUnits: BusinessUnit[],
  location: Country,
) {
  const passwordEncoder = new BCryptPasswordEncoder();
  const edaeUserRepository = datasource.getRepository(edaeUserSchema);

  const edaeUser = EdaeUser.create(
    id,
    name,
    surname1,
    null,
    email,
    new IdentityDocument({
      identityDocumentType: IdentityDocumentType.DNI,
      identityDocumentNumber: '74700994F',
    }),
    roles,
    businessUnits,
    TimeZoneEnum.GMT_PLUS_2,
    false,
    location,
    null,
    await passwordEncoder.encodePassword(password),
  );

  return await edaeUserRepository.save(edaeUser);
}

export async function loginEdaeUser(
  httpServer: HttpServer,
  email: string,
  password: string,
) {
  const loginResponse = await supertest(httpServer)
    .post('/edae-360/login')
    .send({
      username: email,
      password: password,
    });

  return loginResponse.body.accessToken;
}
