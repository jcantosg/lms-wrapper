import { Title } from '#academic-offering/domain/entity/title.entity';

export interface TitleResponseBasic {
  id: string;
  name: string;
  businessUnitCode: string;
}

export class GetAllTitlesPlainResponse {
  static create(titles: Title[]): TitleResponseBasic[] {
    return titles.map((title) => ({
      id: title.id,
      name: title.name,
      businessUnitCode: title.businessUnit.code,
    }));
  }
}
