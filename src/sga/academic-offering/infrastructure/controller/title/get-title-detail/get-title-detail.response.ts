import { Title } from '#academic-offering/domain/entity/title.entity';

export interface BusinessUnitResponse {
  id: string;
  name: string;
}

export interface TitleDetailResponse {
  id: string;
  name: string;
  officialCode: string | null;
  officialTitle: string;
  officialProgram: string;
  businessUnit: BusinessUnitResponse;
}

export class GetTitleDetailResponse {
  static create(title: Title): TitleDetailResponse {
    return {
      id: title.id,
      name: title.name,
      officialCode: title.officialCode,
      officialTitle: title.officialTitle,
      officialProgram: title.officialProgram,
      businessUnit: {
        id: title.businessUnit.id,
        name: title.businessUnit.name,
      },
    };
  }
}
