import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { GetAcademicProgramResponse } from '#academic-offering/infrastructure/controller/get-academic-program/get-academic-program.response';
import { GetAcademicProgramHandler } from '#academic-offering/applicaton/get-academic-program/get-academic-program.handler';
import { GetAcademicProgramQuery } from '#academic-offering/applicaton/get-academic-program/get-academic-program.query';

@Controller('academic-program')
export class GetAcademicProgramController {
  constructor(private handler: GetAcademicProgramHandler) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  @Get(':id')
  async getAcademicProgram(@Param('id') id: string, @Req() req: AuthRequest) {
    const query = new GetAcademicProgramQuery(
      id,
      req.user.businessUnits.map((bu) => bu.id),
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    const academicProgram = await this.handler.handle(query);

    return GetAcademicProgramResponse.create(academicProgram);
  }
}
