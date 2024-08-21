import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { loginStudent } from '#test/e2e/sga/e2e-auth-helper';
import { GetStudentAdministrativeProcessesE2eSeed } from '#test/e2e/student-360/administrative-process/get-student-administrative-processes.e2e-seed';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';

const path = '/student-360/administrative-process';

describe('/student-360/administrative-process (POST)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let studentToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetStudentAdministrativeProcessesE2eSeed(datasource);
    await seeder.arrange();
    studentToken = await loginStudent(
      httpServer,
      GetStudentAdministrativeProcessesE2eSeed.studentUniversaeEmail,
      GetStudentAdministrativeProcessesE2eSeed.studentPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).post(path).expect(401);
  });

  it('should return invalid academic record', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(studentToken, { type: 'bearer' })
      .field('academicRecordId', '')
      .field('type', AdministrativeProcessTypeEnum.ACCESS_DOCUMENTS)
      .attach('files', 'test/universae.jpeg')
      .expect(409);

    expect(response.body.message).toBe('student-360.academic-record.invalid');
  });

  it('should return academic record not found', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(studentToken, { type: 'bearer' })
      .field('academicRecordId', '02e1494d-6219-4c81-b3fd-40a725a04f6f')
      .field('type', AdministrativeProcessTypeEnum.ACCESS_DOCUMENTS)
      .attach('files', 'test/universae.jpeg')
      .expect(404);

    expect(response.body.message).toBe('sga.academic-record.not-found');
  });

  it('should create an administrative process', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(studentToken, { type: 'bearer' })
      .field('academicRecordId', '')
      .field('type', AdministrativeProcessTypeEnum.PHOTO)
      .attach('files', 'test/universae.jpeg')
      .expect(201);

    // usar el repo para ver si se ha guardado
  });

  it('should create another administrative process', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(studentToken, { type: 'bearer' })
      .field(
        'academicRecordId',
        GetStudentAdministrativeProcessesE2eSeed.academicRecordId,
      )
      .field('type', AdministrativeProcessTypeEnum.ACCESS_DOCUMENTS)
      .attach('files', 'test/universae.jpeg')
      .expect(201);

    // usar el repo para ver si se ha guardado
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
