import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  Post,
} from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';

@Controller('v1/super-admin')
export class SuperAdminController {
  constructor(private readonly superAdmin: SuperAdminService) {}

  @Post('login')
  @Header('Cache-Control', 'no-store')
  @HttpCode(200)
  login(@Body() body: unknown) {
    return this.superAdmin.login(body);
  }

  @Get('overview')
  @Header('Cache-Control', 'no-store')
  overview(@Headers('authorization') authorization?: string) {
    return this.superAdmin.overview(authorization);
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Headers('authorization') authorization?: string) {
    return this.superAdmin.logout(authorization);
  }
}
