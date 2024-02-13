export const enumFromValue = <Enum extends PropertyKey>(value: string): Enum =>
  value as Enum;
