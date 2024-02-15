import { DeleteExaminationCenterHandler } from '#business-unit/application/examination-center/delete-examination-center/delete-examination-center.handler';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { DeleteExaminationCenterCommand } from '#business-unit/application/examination-center/delete-examination-center/delete-examination-center.command';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import {
  getAMainExaminationCenter,
  getAnExaminationCenter,
} from '#test/entity-factory';
import { getAnExaminationCenterGetterMock } from '#test/service-factory';
import { ExaminationCenterMockRepository } from '#test/mocks/sga/business-unit/examination-center.mock-repository';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { ExaminationCenterMainException } from '#shared/domain/exception/business-unit/examination-center/examination-center-main.exception';

let handler: DeleteExaminationCenterHandler;
let examinationCenterGetter: ExaminationCenterGetter;
let examinationCenterRepository: ExaminationCenterRepository;
const examinationCenter = getAnExaminationCenter();
const mainExaminationCenter = getAMainExaminationCenter();
let getSpy: any;
let deleteSpy: any;
const command = new DeleteExaminationCenterCommand(examinationCenter.id, [
  'businessUnitID',
]);

describe('Delete Examination Center Handler', () => {
  beforeAll(() => {
    examinationCenterGetter = getAnExaminationCenterGetterMock();
    examinationCenterRepository = new ExaminationCenterMockRepository();
    getSpy = jest.spyOn(examinationCenterGetter, 'get');
    deleteSpy = jest.spyOn(examinationCenterRepository, 'delete');
    handler = new DeleteExaminationCenterHandler(
      examinationCenterRepository,
      examinationCenterGetter,
    );
  });
  it('should delete an examination center', async () => {
    getSpy.mockImplementation((): Promise<ExaminationCenter> => {
      return Promise.resolve(examinationCenter);
    });
    deleteSpy.mockImplementation((): Promise<null> => {
      return Promise.resolve(null);
    });
    await handler.handle(command);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(deleteSpy).toHaveBeenCalledWith(examinationCenter.id);
  });

  it('should throw a ExaminationCenterMainException', async () => {
    getSpy.mockImplementation((): Promise<ExaminationCenter> => {
      return Promise.resolve(mainExaminationCenter);
    });
    await expect(handler.handle(command)).rejects.toThrow(
      ExaminationCenterMainException,
    );
  });
});
