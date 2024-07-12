export interface MoodleCourseResponse {
  id: number;
  categoryid: number;
  shortname: string;
  displayname: string;
}

export interface MoodleCourseContentResponse {
  id: number;
  name: string;
  modules: {
    id: number;
    name: string;
    url: string;
    image: string;
    uservisible: boolean;
    contents:
      | {
          filename: string;
          fileurl: string;
          mimetype: string;
        }[]
      | undefined;
    contentinfo:
      | {
          mimetypes: string[];
        }[]
      | undefined;
  }[];
}

export interface MoodleLoginResponse {
  token: string;
  privatetoken: string | null;
}

export interface MoodleCreateUserResponse {
  id: number;
  username: string;
}

export interface MoodleGetUserResponse {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  department: string;
  firstaccess: number;
  lastaccess: number;
  auth: string;
  suspended: boolean;
  confirmed: boolean;
  lang: string;
  theme: string;
  timezone: string;
  mailformat: number;
  profileimageurlsmall: string;
  profileimageurl: string;
}

export interface MoodleLoginResponse {
  loginurl: string;
}

export interface MoodleCourseActivitiesCompletionResponse {
  statuses: {
    cmid: number;
    state: number;
    timecompleted: number;
    details: {
      rulename: string;
      rulevalue: {
        status: number;
        description: string;
      };
    }[];
  }[];
}

export interface MoodleCourseByFieldResponse {
  courses: MoodleCourseResponse[];
}
