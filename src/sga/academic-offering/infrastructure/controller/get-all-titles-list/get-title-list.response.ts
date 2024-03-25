import { Title } from '#academic-offering/domain/entity/title.entity';

export interface TitleResponse {
  id: string;
  name: string;
  officialCode: string | null;
  officialTitle: string;
  officialProgram: string;
  businessUnit: {
    id: string;
    name: string;
  };
}

export class GetTitleResponse {
  static create(title: Title): TitleResponse {
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
