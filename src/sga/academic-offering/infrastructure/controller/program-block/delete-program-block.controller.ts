import {
  Controller,
  Delete,
  Param,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { DeleteProgramBlockHandler } from '#academic-offering/applicaton/program-block/delete-program-block/delete-program-block.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { DeleteProgramBlockCommand } from '#academic-offering/applicaton/program-block/delete-program-block/delete-program-block.command';

@Controller('program-block')
export class DeleteProgramBlockController {
  constructor(private handler: DeleteProgramBlockHandler) {}

  @Delete(':programBlockId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async deleteProgramBlock(
    @Param('programBlockId') programBlockId: string,
    @Req() req: AuthRequest,
  ) {
    const command = new DeleteProgramBlockCommand(programBlockId, req.user);
    await this.handler.handle(command);
  }
}
