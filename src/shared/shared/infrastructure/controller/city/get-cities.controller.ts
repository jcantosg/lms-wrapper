import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetCitiesHandler } from '#shared/application/get-cities/get-cities.handler';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { GetCitiesQuery } from '#shared/application/get-cities/get-cities.query';
import { GetCitiesResponse } from '#shared/infrastructure/controller/city/get-cities.response';

@Controller('student-360')
export class GetStudentCitiesController {
  constructor(private readonly handler: GetCitiesHandler) {}

  @Get('country/:id/province/:provinceName/city')
  @UseGuards(StudentJwtAuthGuard)
  async getCities(
    @Param('id') id: string,
    @Param('provinceName') name: string,
  ) {
    const query = new GetCitiesQuery(id, name);
    const cities = await this.handler.handle(query);

    return GetCitiesResponse.create(cities);
  }
}
