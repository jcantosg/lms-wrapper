export interface StudentResponseBasic {
  id: string;
  name: string;
  surname: string;
  surname2: string;
  universaeEmail: string;
  avatar: string;
}

export class GetStudentsByBuPeriodsAndProgramsResponse {
  static create(students: any[]): StudentResponseBasic[] {
    return students.map((student) => ({
      id: student.id,
      name: student.name,
      surname: student.surname,
      surname2: student.surname2,
      universaeEmail: student.universaeEmail,
      avatar: student.avatar,
    }));
  }
}
