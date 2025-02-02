import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { GetStudentAcademicRecordsHandler } from '#/student-360/academic-offering/academic-record/application/get-student-academic-records/get-student-academic-records.handler';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { GetStudentAcademicRecordsQuery } from '#/student-360/academic-offering/academic-record/application/get-student-academic-records/get-student-academic-records.query';
import { GetStudentAcademicRecordsResponse } from '#/student-360/academic-offering/academic-record/infrastructure/controller/get-student-academic-records/get-student-academic-records.response';
import { StudentJwtAuthGuard } from '#/student-360/student/infrastructure/auth/student-jwt-auth.guard';

@Controller('student-360')
export class GetStudentAcademicRecordsController {
  constructor(private readonly handler: GetStudentAcademicRecordsHandler) {}

  @Get('academic-record')
  @UseGuards(StudentJwtAuthGuard)
  async getStudentAcademicRecords(
    @Request() req: StudentAuthRequest,
  ): Promise<GetStudentAcademicRecordsResponse> {
    const query = new GetStudentAcademicRecordsQuery(req.user.id);
    const response = await this.handler.handle(query);

    return GetStudentAcademicRecordsResponse.create(response);
  }
}
