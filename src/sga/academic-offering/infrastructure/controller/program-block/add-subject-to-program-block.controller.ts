import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AddSubjectToProgramBlockHandler } from '#academic-offering/applicaton/program-block/add-subject-to-program-block/add-subject-to-program-block.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { AddSubjectToProgramBlockCommand } from '#academic-offering/applicaton/program-block/add-subject-to-program-block/add-subject-to-program-block.command';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { addSubjectToProgramBlockSchema } from '#academic-offering/infrastructure/config/validation-schema/add-subject-to-program-block.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';

interface AddSubjectToProgramBlockBody {
  subjectId: string;
}

@Controller('program-block')
export class AddSubjectToProgramBlockController {
  constructor(private readonly handler: AddSubjectToProgramBlockHandler) {}

  @Put(':id/add-subject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(addSubjectToProgramBlockSchema),
  )
  async addSubjectToProgramBlock(
    @Param('id') programBlockId: string,
    @Body() body: AddSubjectToProgramBlockBody,
    @Request() request: AuthRequest,
  ) {
    const command = new AddSubjectToProgramBlockCommand(
      programBlockId,
      body.subjectId,
      request.user,
    );
    await this.handler.handle(command);
  }
}
