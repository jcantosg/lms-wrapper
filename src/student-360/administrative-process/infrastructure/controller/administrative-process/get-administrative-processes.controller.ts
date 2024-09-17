import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { GetAllStudentAdministrativeProcessesHandler } from '#student-360/administrative-process/application/get-administrative-processes/get-administrative-processes.handler';
import {
  AdministrativeProcessResponseBody,
  GetAllStudentAdministrativeProcessesResponse,
} from '#student-360/administrative-process/infrastructure/controller/administrative-process/get-administrative-processes.response';
import { GetAllStudentAdministrativeProcessesQuery } from '#student-360/administrative-process/application/get-administrative-processes/get-administrative-processes.query';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';

@Controller('student-360')
export class GetAllStudentAdministrativeProcessesController {
  constructor(
    private readonly handler: GetAllStudentAdministrativeProcessesHandler,
  ) {}

  @Get('administrative-processes')
  @UseGuards(StudentJwtAuthGuard)
  async getAllStudentAdministrativeProcesses(
    @Req() req: StudentAuthRequest,
  ): Promise<AdministrativeProcessResponseBody> {
    const query = new GetAllStudentAdministrativeProcessesQuery(req.user);

    const { administrativeProcesses } = await this.handler.handle(query);

    return GetAllStudentAdministrativeProcessesResponse.create(
      administrativeProcesses,
    );
  }
}
