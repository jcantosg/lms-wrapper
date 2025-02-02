import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export const adminUsers = [
  {
    id: '0514d6fb-f449-4d2f-b2de-26f04779a9be',
    email: 'gestor360_spain@universae.com',
    password: 'test123',
    roles: [AdminUserRoles.GESTOR_360],
    name: 'Gestor360_spain',
    country: 'spain',
    businessUnits: ['MADRID', 'MURCIA', 'BARCELONA', 'BARCELONA2'],
  },
  {
    id: '624ce632-aafc-40ce-a828-163db2d355b1',
    email: 'supervisor_360_spain@universae.com',
    password: 'test123',
    roles: [AdminUserRoles.SUPERVISOR_360],
    name: 'Supervisor360_spain',
    country: 'spain',
    businessUnits: ['MADRID', 'MURCIA', 'BARCELONA', 'BARCELONA2'],
  },
  {
    id: '82adfad9-daa4-42c0-9520-366b219b7459',
    email: 'gestor360_colombia@universae.com',
    password: 'test123',
    roles: [AdminUserRoles.GESTOR_360],
    name: 'Gestor360_latam',
    country: 'colombia',
    businessUnits: ['COLOMBIA'],
  },
  {
    id: '6e1c2e45-085b-4cc1-8125-6098e98748c6',
    email: 'supervisor_360_colombia@universae.com',
    password: 'test123',
    roles: [AdminUserRoles.SUPERVISOR_360],
    name: 'Supervisor360_latam',
    country: 'colombia',
    businessUnits: ['COLOMBIA'],
  },
  {
    id: 'c9fc54cf-b5fa-49c4-9946-eb714382fe8b',
    email: 'gestor360_mix@universae.com',
    password: 'test123',
    roles: [AdminUserRoles.GESTOR_360],
    name: 'Gestor360_mix',
    country: 'mix',
    businessUnits: ['COLOMBIA', 'MADRID'],
  },
  {
    id: '0673ddbc-086f-4fbf-bec9-a9ec9dcda30a',
    email: 'secretaria_spain@universae.com',
    password: 'test123',
    roles: [AdminUserRoles.SECRETARIA],
    name: 'Secretaria',
    country: 'spain',
    businessUnits: ['MADRID', 'MURCIA', 'BARCELONA', 'BARCELONA2'],
  },
  {
    id: '847c27ba-6c37-401a-9c14-353512e3ef88',
    email: 'supervisor_secretaria_spain@universae.com',
    password: 'test123',
    roles: [AdminUserRoles.SUPERVISOR_SECRETARIA],
    name: 'Supervisor_secretaria_spain',
    country: 'spain',
    businessUnits: ['MADRID', 'MURCIA', 'BARCELONA', 'BARCELONA2'],
  },
  {
    id: '25d9f97e-251f-4f7e-a94d-c2cc52395ec8',
    email: 'secretaria_colombia@universae.com',
    password: 'test123',
    roles: [AdminUserRoles.SECRETARIA],
    name: 'Secretaria_colombia',
    country: 'colombia',
    businessUnits: ['COLOMBIA'],
  },
  {
    id: 'fc6b4940-633f-41ef-928c-3114a89e57ea',
    email: 'supervisor_secretaría_colombia@universae.com',
    password: 'test123',
    roles: [AdminUserRoles.SUPERVISOR_SECRETARIA],
    name: 'Supervisor_secretaría_colombia',
    country: 'colombia',
    businessUnits: ['COLOMBIA'],
  },
  {
    id: '14d61bdd-ec3a-4b94-b0c1-a5c49247051c',
    email: 'secretaria_mix@universae.com',
    password: 'test123',
    roles: [AdminUserRoles.SECRETARIA],
    name: 'Secretaria_mix',
    country: 'mix',
    businessUnits: ['COLOMBIA', 'MADRID'],
  },
];
