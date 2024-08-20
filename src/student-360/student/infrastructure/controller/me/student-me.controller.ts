import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { StudentMeResponse } from '#student-360/student/infrastructure/controller/me/student-me-response';
import { GetAllStudentAdministrativeProcessesHandler } from '#student-360/administrative-process/application/get-administrative-processes/get-administrative-processes.handler';
import { GetAllStudentAdministrativeProcessesQuery } from '#student-360/administrative-process/application/get-administrative-processes/get-administrative-processes.query';
import { AdministrativeProcessStatusEnum } from '#student/domain/enum/administrative-process-status.enum';

@Controller('student-360')
export class StudentMeController {
  constructor(
    private readonly handler: GetAllStudentAdministrativeProcessesHandler,
  ) {}
  @Get('me')
  @UseGuards(StudentJwtAuthGuard)
  async getMe(@Request() req: StudentAuthRequest): Promise<StudentMeResponse> {
    const query = new GetAllStudentAdministrativeProcessesQuery(req.user);
    const administrativeProcesses = await this.handler.handle(query);

    return StudentMeResponse.create(
      req.user,
      administrativeProcesses.some(
        (ap) =>
          ap.status === AdministrativeProcessStatusEnum.PENDING_DOCUMENTS ||
          ap.status === AdministrativeProcessStatusEnum.PENDING_VALIDATION ||
          ap.status === AdministrativeProcessStatusEnum.REJECTED,
      ),
    );
  }
}
