import { ValueObject } from '#/sga/shared/domain/value-object/value-object';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';

export interface AdministrativeProcessFileValues {
  mimeType: string;
  name: string;
  size: number;
  documentType: AdministrativeProcessTypeEnum;
  url: string;
}

export class AdministrativeProcessFile extends ValueObject<AdministrativeProcessFileValues> {
  constructor(
    administrativeProcessFileValues: AdministrativeProcessFileValues,
  ) {
    super(administrativeProcessFileValues);
  }
}
