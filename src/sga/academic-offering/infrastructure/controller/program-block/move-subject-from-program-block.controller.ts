import {
  Body,
  Controller,
  Param,
  Put,
  UseGuards,
  Request,
  UsePipes,
} from '@nestjs/common';
import { MoveSubjectFromProgramBlockCommand } from '#academic-offering/applicaton/program-block/move-subject-from-program-block/move-subject-from-program-block.command';
import { MoveSubjectFromProgramBlockHandler } from '#academic-offering/applicaton/program-block/move-subject-from-program-block/move-subject-from-program-block.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { moveSubjectSchema } from '#academic-offering/infrastructure/config/validation-schema/move-subject-from-program-block.schema';

interface MoveSubjectBody {
  subjectIds: string[];
  newBlockId: string;
}

@Controller('program-block')
export class MoveSubjectController {
  constructor(private readonly handler: MoveSubjectFromProgramBlockHandler) {}

  @Put(':id/move-subject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.GESTOR_360,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.SUPERADMIN,
  )
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(moveSubjectSchema),
  )
  async moveSubject(
    @Body() body: MoveSubjectBody,
    @Param('id') currentBlockId: string,
    @Request() req: AuthRequest,
  ) {
    const command = new MoveSubjectFromProgramBlockCommand(
      body.subjectIds,
      body.newBlockId,
      req.user,
      currentBlockId,
    );
    await this.handler.handle(command);
  }
}
