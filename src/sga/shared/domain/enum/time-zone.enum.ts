export enum TimeZoneEnum {
  GMT_MINUS_12 = 'GMT-12: Línea de cambio de fecha',
  GMT_MINUS_11 = 'GMT-11: Samoa, Niue',
  GMT_MINUS_10 = 'GMT-10: Hawái, Islas Cook',
  GMT_MINUS_9 = 'GMT-9: Alaska',
  GMT_MINUS_8 = 'GMT-8: Tiempo del Pacífico, Baja California',
  GMT_MINUS_7 = 'GMT-7: Tiempo de la Montaña (EE. UU.)',
  GMT_MINUS_6 = 'GMT-6: Tiempo Central (EE. UU.), Ciudad de México',
  GMT_MINUS_5 = 'GMT-5: Tiempo del Este (EE. UU.), Bogotá, Lima',
  GMT_MINUS_4 = 'GMT-4: Tiempo del Atlántico (EE. UU.), Caracas',
  GMT_MINUS_3 = 'GMT-3: Buenos Aires, Santiago, Brasilia',
  GMT_MINUS_2 = 'GMT-2: Islas Georgias del Sur',
  GMT_MINUS_1 = 'GMT-1: Azores, Cabo Verde',
  GMT = 'GMT: Tiempo Medio de Greenwich (Londres, Lisboa)',
  GMT_PLUS_1 = 'GMT+1: Europa Central (París, Berlín), Madrid',
  GMT_PLUS_2 = 'GMT+2: Atenas, Helsinki, Beirut',
  GMT_PLUS_3 = 'GMT+3: Moscú, Estambul, Riad',
  GMT_PLUS_4 = 'GMT+4: Dubai, Bakú, Mauricio',
  GMT_PLUS_5 = 'GMT+5: Islamabad, Yekaterinburg',
  GMT_PLUS_6 = 'GMT+6: Almaty, Astaná',
  GMT_PLUS_7 = 'GMT+7: Bangkok, Jakarta, Ho Chi Minh',
  GMT_PLUS_8 = 'GMT+8: Pekín, Singapur, Manila',
  GMT_PLUS_9 = 'GMT+9: Tokio, Seúl',
  GMT_PLUS_10 = 'GMT+10: Sídney, Guam',
  GMT_PLUS_11 = 'GMT+11: Islas Salomón, Nueva Caledonia',
  GMT_PLUS_12 = 'GMT+12: Fiyi, Tuvalu',
}

export function getAllTimeZones(): string[] {
  return Object.values(TimeZoneEnum);
}
