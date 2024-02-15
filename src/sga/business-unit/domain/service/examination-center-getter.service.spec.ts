import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { getAnExaminationCenter } from '#test/entity-factory';
import { ExaminationCenterMockRepository } from '#test/mocks/sga/business-unit/examination-center.mock-repository';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { ExaminationCenterNotFoundException } from '#shared/domain/exception/business-unit/examination-center/examination-center-not-found.exception';

let service: ExaminationCenterGetter;
let repository: ExaminationCenterRepository;
let getSpy: any;

const examinationCenter = getAnExaminationCenter();

describe('Examination Center Getter Service', () => {
  beforeAll(() => {
    repository = new ExaminationCenterMockRepository();
    service = new ExaminationCenterGetter(repository);
    getSpy = jest.spyOn(repository, 'get');
  });
  it('should return an examination center', async () => {
    getSpy.mockImplementation((): Promise<ExaminationCenter | null> => {
      return Promise.resolve(examinationCenter);
    });
    const newExaminationCenter = await service.get(examinationCenter.id);
    expect(newExaminationCenter).toEqual(examinationCenter);
  });
  it('should throw an ExaminationCenterNotFoundException', async () => {
    getSpy.mockImplementation((): Promise<ExaminationCenter | null> => {
      return Promise.resolve(null);
    });
    await expect(service.get(examinationCenter.id)).rejects.toThrow(
      ExaminationCenterNotFoundException,
    );
  });
});
