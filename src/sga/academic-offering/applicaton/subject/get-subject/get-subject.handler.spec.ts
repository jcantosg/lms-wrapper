import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';
import { getASubject } from '#test/entity-factory';
import { getASubjectGetterMock } from '#test/service-factory';
import { GetSubjectHandler } from '#academic-offering/applicaton/subject/get-subject/get-subject.handler';
import { GetSubjectQuery } from '#academic-offering/applicaton/subject/get-subject/get-subject.query';

let handler: GetSubjectHandler;
let subjectGetter: SubjectGetter;
let getSpy: any;

const subject = getASubject();
const query = new GetSubjectQuery(subject.id, ['businessUnitId'], true);

describe('Get Subject Handler', () => {
  beforeAll(() => {
    subjectGetter = getASubjectGetterMock();
    handler = new GetSubjectHandler(subjectGetter);
    getSpy = jest.spyOn(subjectGetter, 'getByAdminUser');
  });

  it('should return a subject', async () => {
    getSpy.mockImplementation((): Promise<Subject> => {
      return Promise.resolve(subject);
    });
    const newSubject = await handler.handle(query);
    expect(newSubject).toEqual(subject);
  });

  it('should throw an SubjectNotFoundException', async () => {
    getSpy.mockImplementation(() => {
      throw new SubjectNotFoundException();
    });
    await expect(handler.handle(query)).rejects.toThrow(
      SubjectNotFoundException,
    );
  });
});
