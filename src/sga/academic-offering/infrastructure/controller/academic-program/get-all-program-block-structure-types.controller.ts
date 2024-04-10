import { Controller, Get, UseGuards } from '@nestjs/common';
import { getAllProgramBlockStructureTypes } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';

@Controller('structure-type')
export class GetAllProgramBlockStructureTypesController {
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAllStructureTypes() {
    return getAllProgramBlockStructureTypes();
  }
}
