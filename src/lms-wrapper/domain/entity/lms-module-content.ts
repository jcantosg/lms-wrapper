import { ValueObject } from '#/sga/shared/domain/value-object/value-object';

export interface LmsModuleContentBody {
  id: number;
  name: string;
  modules: {
    id: number;
    name: string;
    url: string;
    contents:
      | {
          name: string;
          url: string;
          mimeType: string;
        }[]
      | null;
  }[];
}

export class LmsModuleContent extends ValueObject<LmsModuleContentBody> {
  constructor(lmsModuleContentBody: LmsModuleContentBody) {
    super(lmsModuleContentBody);
  }
}