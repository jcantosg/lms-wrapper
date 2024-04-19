import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RemoveSubjectFromProgramBlockHandler } from '#academic-offering/applicaton/program-block/remove-subject-from-program-block/remove-subject-from-program-block.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { RemoveSubjectFromProgramBlockCommand } from '#academic-offering/applicaton/program-block/remove-subject-from-program-block/remove-subject-from-program-block.command';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { removeSubjectsFromProgramBlockSchema } from '#academic-offering/infrastructure/config/validation-schema/remove-subjects-from-program-block.schema';

interface RemoveSubjectsFromProgramBlockBody {
  subjectIds: string[];
}

@Controller('program-block')
export class RemoveSubjectsFromProgramBlockController {
  constructor(private readonly handler: RemoveSubjectFromProgramBlockHandler) {}

  @Put(':id/remove-subject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(removeSubjectsFromProgramBlockSchema),
  )
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.GESTOR_360,
    AdminUserRoles.SUPERVISOR_360,
  )
  async removeSubjectsFromProgramBlock(
    @Param('id') programBlockId: string,
    @Body() body: RemoveSubjectsFromProgramBlockBody,
    @Request() request: AuthRequest,
  ) {
    const command = new RemoveSubjectFromProgramBlockCommand(
      body.subjectIds,
      programBlockId,
      request.user,
    );
    await this.handler.handle(command);
  }
}
