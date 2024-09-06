import { ValueObject } from '#/sga/shared/domain/value-object/value-object';

export interface LmsModuleContentBody {
  id: number;
  name: string;
  modules: {
    id: number;
    isVisible: boolean;
    name: string;
    url: string;
    type: string;
    moduleType: string;
    description: string;
    contents:
      | {
          id: number;
          name: string;
          url: string;
          mimeType: string;
          isCompleted: boolean;
        }[]
      | null;
  }[];
}

export class LmsModuleContent extends ValueObject<LmsModuleContentBody> {
  constructor(lmsModuleContentBody: LmsModuleContentBody) {
    super(lmsModuleContentBody);
  }
}
