import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayloadDTO } from '../dtos/jwt_payload.dto';

export const CurrentUser = createParamDecorator(
  (
    data: keyof JwtPayloadDTO | undefined,
    ctx: ExecutionContext,
  ): JwtPayloadDTO | string | number | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayloadDTO;
    return data ? user?.[data] : user;
  },
);
