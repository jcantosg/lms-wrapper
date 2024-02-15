import { GetExaminationCenterHandler } from '#business-unit/application/examination-center/get-examination-center/get-examination-center.handler';
import { GetExaminationCenterQuery } from '#business-unit/application/examination-center/get-examination-center/get-examination-center.query';
import { getAnExaminationCenter } from '#test/entity-factory';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { getAnExaminationCenterGetterMock } from '#test/service-factory';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { ExaminationCenterNotFoundException } from '#shared/domain/exception/business-unit/examination-center/examination-center-not-found.exception';

let handler: GetExaminationCenterHandler;
let examinationCenterGetter: ExaminationCenterGetter;
let getSpy: any;
const examinationCenter = getAnExaminationCenter();
const query = new GetExaminationCenterQuery(examinationCenter.id, [
  'businessUnitId',
]);

describe('Get Examination Center Handler', () => {
  beforeAll(() => {
    examinationCenterGetter = getAnExaminationCenterGetterMock();
    handler = new GetExaminationCenterHandler(examinationCenterGetter);
    getSpy = jest.spyOn(examinationCenterGetter, 'getByAdminUser');
  });
  it('should return an examination center getter', async () => {
    getSpy.mockImplementation((): Promise<ExaminationCenter> => {
      return Promise.resolve(examinationCenter);
    });
    const newExaminationCenter = await handler.handle(query);
    expect(newExaminationCenter).toEqual(examinationCenter);
  });
  it('should throw an ExaminationCenterNotFoundException', async () => {
    getSpy.mockImplementation(() => {
      throw new ExaminationCenterNotFoundException();
    });
    await expect(handler.handle(query)).rejects.toThrow(
      ExaminationCenterNotFoundException,
    );
  });
});
