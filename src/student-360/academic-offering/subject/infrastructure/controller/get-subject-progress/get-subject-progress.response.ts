interface GetSubjectProgressResponseBody {
  progress: number;
}

export class GetSubjectProgressResponse {
  static create(progress: number): GetSubjectProgressResponseBody {
    return {
      progress,
    };
  }
}
