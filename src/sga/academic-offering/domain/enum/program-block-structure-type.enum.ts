export enum ProgramBlockStructureType {
  QUATRIMESTER = 'Cuatrimestre',
  SEMESTER = 'Semestre',
  YEARLY = 'Anual',
  CUSTOM = 'Personalizado',
}

export enum ProgramBlockNaming {
  QUATRIMESTER = 'Cuatrimestre',
  SEMESTER = 'Semestre',
  YEARLY = 'Año',
  CUSTOM = 'Bloque',
}

export function getBlockPrefix(type: ProgramBlockStructureType): string {
  const mapping: { [key in ProgramBlockStructureType]: string } = {
    [ProgramBlockStructureType.QUATRIMESTER]: ProgramBlockNaming.QUATRIMESTER,
    [ProgramBlockStructureType.SEMESTER]: ProgramBlockNaming.SEMESTER,
    [ProgramBlockStructureType.YEARLY]: ProgramBlockNaming.YEARLY,
    [ProgramBlockStructureType.CUSTOM]: ProgramBlockNaming.CUSTOM,
  };

  return mapping[type];
}

export function getAllProgramBlockStructureTypes(): string[] {
  return Object.values(ProgramBlockStructureType);
}
