import { Province } from '#shared/domain/value-object/province.value-object';

export class GetProvincesResponse {
  static create(provinces: Province[]): string[] {
    return provinces.map((province: Province) => province.value);
  }
}
