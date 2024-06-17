import { FetchWrapper } from '#shared/infrastructure/clients/fetch-wrapper';
import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';
import { LmsWrapper } from '#/lms-wrapper/domain/service/lms-wrapper';
import { stringToCamelCase } from '#shared/domain/lib/string-to-camel-case';

const moodleCourseContentIcon: { [id: string]: string } = {
  temario: '/temario.svg',
  infografias: '/infografias.svg',
  clasesInteractivas: '/clases_interactivas.svg',
  simuladores: '/simuladores.svg',
  profesor180: '/profesor180.svg',
  entorno3603DVR: '/entorno360.svg',
  simuladores3DAR: '/simuladores.svg',
};

interface MoodleCourseResponse {
  id: number;
  categoryid: number;
  shortname: string;
  displayname: string;
}

interface MoodleCourseContentResponse {
  id: number;
  name: string;
  modules: {
    id: number;
    name: string;
    image: string;
  }[];
}

interface MoodleLoginResponse {
  token: string;
  privatetoken: string | null;
}

interface MoodleCreateUserResponse {
  id: number;
  username: string;
}

export class MoodleWrapper implements LmsWrapper {
  constructor(
    private readonly wrapper: FetchWrapper,
    private readonly token: string,
    private readonly url = '/webservice/rest/server.php',
    private readonly loginUrl = '/login/token.php',
  ) {}

  async getCourse(id: number): Promise<LmsCourse> {
    const queryParams = `wstoken=${this.token}&wsfunction=core_course_get_courses&moodlewsrestformat=json&options[ids][0]=${id}`;
    const courseResponse: MoodleCourseResponse[] = await this.wrapper.get(
      this.url,
      queryParams,
    );
    const course = courseResponse[0];
    const courseContentQueryParam = `wstoken=${this.token}&wsfunction=core_course_get_contents&moodlewsrestformat=json&courseid=${id}`;
    const courseContentResponse: MoodleCourseContentResponse[] =
      await this.wrapper.get(
        '/webservice/rest/server.php',
        courseContentQueryParam,
      );

    return new LmsCourse({
      id: course.id,
      categoryId: course.categoryid,
      shortname: course.shortname,
      name: course.displayname,
      modules: courseContentResponse
        .map((courseContentResponse) => {
          return {
            id: courseContentResponse.id,
            name: stringToCamelCase(courseContentResponse.name),
            image:
              moodleCourseContentIcon[
                stringToCamelCase(courseContentResponse.name)
              ] ?? '/courseContent.svg',
          };
        })
        .filter((value) => value.name !== '' && value.name !== 'partners'),
    });
  }

  async getAllCourses(): Promise<LmsCourse[]> {
    const queryParams = `wstoken=${this.token}&wsfunction=core_course_get_courses&moodlewsrestformat=json`;
    const courseResponse: MoodleCourseResponse[] = await this.wrapper.get(
      this.url,
      queryParams,
    );

    return courseResponse.map((course) => {
      return new LmsCourse({
        id: course.id,
        categoryId: course.categoryid,
        shortname: course.shortname,
        name: course.displayname,
        modules: [],
      });
    });
  }

  async saveCourse(lmsCourse: LmsCourse): Promise<void> {
    const queryParams = `wstoken=${this.token}&wsfunction=core_course_create_courses&moodlewsrestformat=json&courses[0][fullname]=${lmsCourse.value.name}&courses[0][shortname]=${lmsCourse.value.shortname}&courses[0][categoryid]=${lmsCourse.value.categoryId}`;
    await this.wrapper.post(this.url, queryParams);
  }

  async deleteStudent(id: number): Promise<void> {
    const queryParams = `wstoken=${this.token}&wsfunction=core_user_delete_users&moodlewsrestformat=json&userids[0]=${id}`;
    await this.wrapper.post(this.url, queryParams);
  }

  async saveStudent(
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<number> {
    const queryParams = `wstoken=${this.token}&wsfunction=core_user_create_users&moodlewsrestformat=json&users[0][username]=${username}&users[0][firstname]=${firstName}&users[0][lastname]=${lastName}&users[0][email]=${email}&users[0][password]=${password}`;
    const response: MoodleCreateUserResponse[] = await this.wrapper.post(
      this.url,
      queryParams,
    );

    return response[0].id;
  }

  async login(
    username: string,
    password: string,
    service: string,
  ): Promise<string> {
    const queryParams = `username=${username}&password=${password}&service=${service}`;

    const response: MoodleLoginResponse = await this.wrapper.get(
      this.loginUrl,
      queryParams,
    );

    return response.token;
  }
}
