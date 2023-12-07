import { v4 as uuid } from 'uuid';
import { Country } from '../src/business-unit/domain/entity/country.entity';

export const getACountry = (id = uuid()): Country => {
  return Country.create(id, 'ES', 'ESP', 'España', '+34', '🇪🇸');
};
