import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class EdaeUserJwtAuthGuard extends AuthGuard('edae-jwt') {}
