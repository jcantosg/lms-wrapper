import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { loginStudent } from '#test/e2e/sga/e2e-auth-helper';
import { GetStudentAdministrativeProcessesE2eSeed } from '#test/e2e/student-360/administrative-process/get-student-administrative-processes.e2e-seed';

const path = `/student-360/administrative-processes`;

describe('/student-360/administrative-processes (GET)', () => {
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
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return all student administrative processes', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(studentToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toEqual({
      identityDocument: {
        id: GetStudentAdministrativeProcessesE2eSeed.identityDocumentAdministrativeProcessId,
        status: 'Pendiente de validación',
        files: [
          {
            url: 'https://tolentinoabogados.com/wp-content/uploads/2014/04/dni-e1618306841277.jpg',
            name: 'dni-frente.jpg',
            size: 123,
            mymeType: 'jpg',
          },
          {
            url: 'https://phantom-elmundo.unidadeditorial.es/2942a626cf35283b77b582ff0ea6aa46/resize/828/f/jpg/assets/multimedia/imagenes/2021/06/04/16228037055335.jpg',
            name: 'dni-reverso.jpg',
            size: 125,
            mymeType: 'jpg',
          },
        ],
      },
      photo: {
        id: GetStudentAdministrativeProcessesE2eSeed.photoAdministrativeProcessId,
        status: 'Pendiente de validación',
        files: [
          {
            url: 'https://img.freepik.com/fotos-premium/retrato-hombre-negocios-expresion-cara-seria-fondo-estudio-espacio-copia-bengala-persona-corporativa-enfoque-pensamiento-duda-mirada-facial-dilema-o-concentracion_590464-84924.jpg',
            name: 'foto.jpg',
            size: 121,
            mymeType: 'jpg',
          },
        ],
      },
      academicRecords: [
        {
          id: GetStudentAdministrativeProcessesE2eSeed.academicRecordId,
          titleName: 'Ingenieria informatica',
          accessDocumentation: {
            id: GetStudentAdministrativeProcessesE2eSeed.accessDocumentAdministrativeProcessId,
            status: 'Pendiente de validación',
            files: [
              {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Documento_Espa%C3%B1ol.jpg/347px-Documento_Espa%C3%B1ol.jpg',
                name: 'document-de-acceso.jpg',
                size: 111,
                mymeType: 'jpg',
              },
            ],
          },
          academicRecognition: null,
          resignation: null,
          showRecognitionAndResignation: true,
        },
      ],
    });
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
