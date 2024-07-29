import { Title } from '#academic-offering/domain/entity/title.entity';

export interface TitleTeacherChatResponse {
  id: string;
  name: string;
}

export class GetTitlesTeacherChatResponse {
  static create(titles: Title[]): TitleTeacherChatResponse[] {
    return titles.map((title) => ({
      id: title.id,
      name: title.name,
    }));
  }
}
