import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export function parseEmail(businessUnit: BusinessUnit): string {
  switch (businessUnit.code) {
    case 'MADRID':
      return 'secretaria.madrid@universae.com';
    case 'BARCELONA':
      return 'secretaria.barcelona@universae.com';
    case 'BARCELONA2':
      return 'secretaria.barcelona2@universae.com';
    case 'MURCIA':
      return 'secretaria.murcia@universae.com';
    default:
      return 'secretaria.madrid@universae.com';
  }
}

export function parseAddress(businessUnit: BusinessUnit): string {
  switch (businessUnit.code) {
    case 'MADRID':
      return 'Avenida Isla Graciosa 5, 28703, San Sebastian de los Reyes, Madrid';
    case 'BARCELONA':
      return 'Avenida del Maresme 64 08940 Cornellà de Llobregat, Barcelona';
    case 'BARCELONA2':
      return 'Calle del Samontà 21-25 08970 Sant Joan Despí, Barcelona';
    case 'MURCIA':
      return 'Avenida Principal 26-13 30169 San Ginés, Murcia';
    default:
      return 'Avenida Isla Graciosa 5, 28703, San Sebastian de los Reyes, Madrid';
  }
}
