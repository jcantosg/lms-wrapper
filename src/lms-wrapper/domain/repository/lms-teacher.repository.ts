export abstract class LmsTeacherRepository {
  /* TODO Use LmsTeacherEntity*/
  abstract getUserSessionKeyUrl(lmsTeacherEmail: string): Promise<string>;
}
