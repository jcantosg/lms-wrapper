interface CreateCommunicationResponseBody {
  studentCount: number;
}

export class CreateCommunicationResponse {
  static create(studentCount: number): CreateCommunicationResponseBody {
    return {
      studentCount,
    };
  }
}
