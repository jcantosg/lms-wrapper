import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { v4 as uuid } from 'uuid';
import { getACountry, getAnAdminUser } from '#test/entity-factory';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';

const country = getACountry();
const user = getAnAdminUser();

describe('Examination Center Creation', () => {
  it('should create an examination center', () => {
    const businessUnit = BusinessUnit.create(
      uuid(),
      'BusinessUnitTestName',
      'BusinessUnitTestCode',
      country,
      user,
    );
    const resultCode = 'BUS01';
    const examinationCenter = ExaminationCenter.createFromBusinessUnit(
      uuid(),
      businessUnit,
      user,
      'BUS01',
    );
    expect(examinationCenter.code).toEqual(resultCode);
  });
});
