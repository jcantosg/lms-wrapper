import { FetchWrapper } from '#shared/infrastructure/clients/fetch-wrapper';
import { LmsCourse } from '#lms-wrapper/domain/entity/lms-course';
import { LmsWrapper } from '#lms-wrapper/domain/service/lms-wrapper';
import { stringToCamelCase } from '#shared/domain/lib/string-to-camel-case';
import { LmsModuleContent } from '#lms-wrapper/domain/entity/lms-module-content';
import { BadRequestException } from '@nestjs/common';
import {
  MoodleCourseActivitiesCompletionResponse,
  MoodleCourseByFieldResponse,
  MoodleCourseContentResponse,
  MoodleCourseModuleContentResponse,
  MoodleCourseResponse,
  MoodleCreateUserResponse,
  MoodleGetUserResponse,
  MoodleLoginResponse,
  MoodleVideotimeResponse,
} from '#lms-wrapper/infrastructure/wrapper/moodle-responses';
import { LmsStudent } from '#lms-wrapper/domain/entity/lms-student';
import { formatMoodleDescriptions } from '#shared/domain/lib/format-moodle-descriptions';
import { formatMoodleNames } from '#shared/domain/lib/format-moodle-names';

const moodleCourseContentIcon: { [id: string]: string } = {
  temario: '/temario.svg',
  infografias: '/infografias.svg',
  clasesInteractivas: '/clases_interactivas.svg',
  simuladores: '/simuladores.svg',
  profesor180: '/profesor180.svg',
  entorno3603DVR: '/entorno360.svg',
  simuladores3DAR: '/simuladores.svg',
};

const moodleResourceType: { [id: string]: string } = {
  resource: 'pdf',
  videotime: 'video',
  scorm: 'scorm',
  webgl: 'webgl',
};

export enum MoodleCourseModuleStatus {
  NON_COMPLETED,
  COMPLETED,
}

const STUDENT_ROLE_ID = 5;

const warningRegex = new RegExp('class="(aviso)[a-z]+"');

type MoodleModuleContent = {
  id: number;
  type: string;
  name: string;
  url: string;
  isCompleted: boolean;
  contents:
    | {
        filename: string;
        fileurl: string;
        mimetype: string;
      }[]
    | undefined;
};
type Modules = {
  id: number;
  name: string;
  type: string;
  url: string;
  indexPosition: number;
  description: string;
  content: MoodleModuleContent[];
}[];

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

    return this.createCourse(course, courseContentResponse);
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
        progress: 0,
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

  async getStudentByEmail(
    universaeEmail: string,
    personalEmail: string,
  ): Promise<any> {
    const queryParams = `wstoken=${this.token}&wsfunction=core_user_get_users_by_field&moodlewsrestformat=json&field=email&values[0]=${universaeEmail}&values[1]=${personalEmail}`;
    const response: MoodleGetUserResponse[] = await this.wrapper.get(
      this.url,
      queryParams,
    );

    return response.length > 0 ? response[0] : null;
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

  async getCourseContent(
    id: number,
    moduleId: number,
    student: LmsStudent,
    isSpeciality: boolean = false,
  ): Promise<LmsModuleContent> {
    const courseContentQueryParam = `wstoken=${this.token}&wsfunction=core_course_get_contents&moodlewsrestformat=json&courseid=${id}`;
    const courseContentResponse: MoodleCourseContentResponse[] =
      await this.wrapper.get(
        '/webservice/rest/server.php',
        courseContentQueryParam,
      );
    const courseContentModule = courseContentResponse.find(
      (contentResponse) => contentResponse.id == moduleId,
    );
    if (!courseContentModule) {
      throw new BadRequestException();
    }

    const courseActivityStatusQueryParam = `wstoken=${this.token}&wsfunction=core_completion_get_activities_completion_status&moodlewsrestformat=json&courseid=${id}&userid=${student.value.id}`;
    const courseActivitiesCompletionResponse: MoodleCourseActivitiesCompletionResponse =
      await this.wrapper.get(this.url, courseActivityStatusQueryParam);
    if (!isSpeciality) {
      let modules: Modules = [];
      let actualGroup = 0;
      for (const [
        index,
        courseContent,
      ] of courseContentModule.modules.entries()) {
        if (courseContent.modname === 'label') {
          actualGroup = index;
          modules.push({
            id: courseContent.id,
            url: courseContent.url,
            type: this.getModuleType(courseContent.description),
            description: courseContent.description,
            name: formatMoodleDescriptions(courseContent.description),
            indexPosition: actualGroup,
            content: [],
          });
        } else {
          const actualModule = modules.find(
            (module) => module.indexPosition === actualGroup,
          );
          actualModule!.content.push({
            id: courseContent.id,
            name: formatMoodleNames(courseContent.name),
            url: await this.getResourceUrl(courseContent),
            type: moodleResourceType[courseContent.modname],
            isCompleted: courseActivitiesCompletionResponse.statuses.some(
              (status) => {
                return (
                  status.cmid === courseContent.id &&
                  status.state === MoodleCourseModuleStatus.COMPLETED
                );
              },
            ),
            contents: courseContent.contents ?? undefined,
          });
        }
      }
      modules = modules.filter((module) => module.name !== 'Etiqueta');

      return new LmsModuleContent({
        id: courseContentModule.id,
        name: courseContentModule.name,
        modules: modules.map((module) => {
          return {
            id: module.id,
            name: module.name,
            description: module.description,
            type: module.type,
            url: module.url,
            isCompleted: courseActivitiesCompletionResponse.statuses.some(
              (response) => {
                return (
                  response.cmid === module.id &&
                  response.state === MoodleCourseModuleStatus.COMPLETED
                );
              },
            ),
            contents: module.content
              ? module.content.map((content) => {
                  return {
                    id: content.id,
                    url: content.url,
                    mimeType: content.type,
                    name: content.name,
                    isCompleted: content.isCompleted,
                  };
                })
              : null,
          };
        }),
      });
    }
    const modules: Modules = [];
    for (const courseModule of courseContentModule.modules) {
      modules.push({
        id: courseModule.id,
        name: courseModule.name,
        type: this.getModuleType(courseModule.description),
        url: courseModule.url,
        description: courseModule.description
          ? courseModule.description
          : formatMoodleNames(courseModule.name),
        indexPosition: 0,
        content: courseModule.contents
          ? courseModule.contents.map((content) => {
              return {
                id: courseModule.id,
                name: content.filename,
                url: content.fileurl,
                type: content.mimetype,
                isCompleted: true,
                contents: [content],
              };
            })
          : [],
      });
    }

    return new LmsModuleContent({
      id: courseContentModule.id,
      name: courseContentModule.name,
      modules: modules.map((module) => {
        return {
          id: module.id,
          name: module.name,
          type: module.type,
          description: module.description,
          url: module.url,
          isCompleted: courseActivitiesCompletionResponse.statuses.some(
            (response) => {
              return (
                response.cmid === module.id &&
                response.state === MoodleCourseModuleStatus.COMPLETED
              );
            },
          ),
          contents: module.content
            ? module.content.map((content) => {
                return {
                  id: content.id,
                  url: content.url,
                  mimeType: content.type,
                  name: content.name,
                  isCompleted: content.isCompleted,
                };
              })
            : null,
        };
      }),
    });
  }

  public async getByName(name: string): Promise<LmsCourse | null> {
    const queryParams = `wstoken=${this.token}&wsfunction=core_course_get_courses_by_field&moodlewsrestformat=json&field=shortname&value=${name}`;
    const courseResponse: MoodleCourseByFieldResponse = await this.wrapper.get(
      this.url,
      queryParams,
    );
    if (!courseResponse.courses[0]) {
      return null;
    }
    const course = courseResponse.courses[0];
    const courseContentQueryParam = `wstoken=${this.token}&wsfunction=core_course_get_contents&moodlewsrestformat=json&courseid=${course.id}`;
    const courseContentResponse: MoodleCourseContentResponse[] =
      await this.wrapper.get(
        '/webservice/rest/server.php',
        courseContentQueryParam,
      );

    return this.createCourse(course, courseContentResponse);
  }

  async getUrlWithSessionKey(email: string): Promise<string> {
    const userKeyParams = `wstoken=${this.token}&wsfunction=auth_userkey_request_login_url&moodlewsrestformat=json&user[email]=${email}`;
    const loginResponse: MoodleLoginResponse = await this.wrapper.get(
      this.url,
      userKeyParams,
    );

    return `${loginResponse.loginurl}&wantsurl=`;
  }

  async getCourseProgress(courseId: number, studentId: number) {
    const queryParams = `wstoken=${this.token}&wsfunction=core_completion_get_activities_completion_status&moodlewsrestformat=json&courseid=${courseId}&userid=${studentId}`;
    const response: MoodleCourseActivitiesCompletionResponse =
      await this.wrapper.get(this.url, queryParams);
    const modulesNumber = response.statuses.length;
    const completedModulesNumber = response.statuses.filter(
      (modules) =>
        modules.state === 1 &&
        modules.details.some((detail) => detail.rulevalue.status === 1),
    ).length;

    return Math.round((completedModulesNumber / modulesNumber) * 100);
  }

  async deleteCourse(lmsCourse: LmsCourse) {
    const deleteCourseQueryParam = `wstoken=${this.token}&wsfunction=core_course_delete_courses&moodlewsrestformat=json&courseids[0]=${lmsCourse.value.id}`;
    await this.wrapper.post(this.url, deleteCourseQueryParam);
  }

  async updateCourseCompletionStatus(
    lmsCourseModuleId: number,
    studentId: Number,
    newStatus: MoodleCourseModuleStatus,
  ) {
    const updateCourseCompletionStatusQueryParam = `wstoken=${this.token}&wsfunction=core_completion_override_activity_completion_status&moodlewsrestformat=json&cmid=${lmsCourseModuleId}&userid=${studentId}&newstate=${newStatus}`;
    await this.wrapper.post(this.url, updateCourseCompletionStatusQueryParam);
  }

  async createEnrollment(
    courseId: number,
    studentId: number,
    startDate: number,
  ): Promise<void> {
    const queryParams = `wstoken=${this.token}&wsfunction=enrol_manual_enrol_users&moodlewsrestformat=json&enrolments[0][userid]=${studentId}&enrolments[0][courseid]=${courseId}&enrolments[0][roleid]=${STUDENT_ROLE_ID}&enrolments[0][timestart]=${startDate}`;
    await this.wrapper.post(this.url, queryParams);
  }

  async deleteEnrollment(courseId: number, studentId: number): Promise<void> {
    const queryParams = `wstoken=${this.token}&wsfunction=enrol_manual_unenrol_users&moodlewsrestformat=json&enrolments[0][userid]=${studentId}&enrolments[0][courseid]=${courseId}`;
    await this.wrapper.post(this.url, queryParams);
  }

  private async getVideoTimeUrl(courseModuleId: number): Promise<string> {
    const queryParams = `wstoken=${this.token}&wsfunction=mod_videotime_get_videotime&moodlewsrestformat=json&cmid=${courseModuleId}`;
    const { vimeo_url }: MoodleVideotimeResponse = await this.wrapper.get(
      this.url,
      queryParams,
    );

    return vimeo_url;
  }

  private async getResourceUrl(module: MoodleCourseModuleContentResponse) {
    if (module.modname === 'videotime') {
      return await this.getVideoTimeUrl(module.id);
    } else if (module.modname === 'scorm' || module.modname === 'webgl') {
      return module.url;
    } else if (module.contents) {
      return `${module.contents[0].fileurl}&token=${this.token}`;
    }

    return module.url;
  }

  private createCourse(
    course: MoodleCourseResponse,
    courseContentResponse: MoodleCourseContentResponse[],
  ): LmsCourse {
    return new LmsCourse({
      id: course.id,
      categoryId: course.categoryid,
      shortname: course.shortname,
      name: course.displayname,
      progress: 0,
      modules: courseContentResponse
        .map((courseContentResponse) => {
          return {
            id: courseContentResponse.id,
            name: formatMoodleDescriptions(courseContentResponse.description),
            image:
              moodleCourseContentIcon[
                stringToCamelCase(courseContentResponse.name)
              ] ?? '/courseContent.svg',
          };
        })
        .filter((value) => value.name !== '' && value.name !== 'Partners'),
    });
  }

  private getModuleType(description: string): string {
    return warningRegex.test(description) ? 'warning' : 'content';
  }
}
