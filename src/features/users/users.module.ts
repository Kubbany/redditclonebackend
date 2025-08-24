import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entites/user.entity';
import { UsersService } from './services/users.services';
import { UsersController } from './controllers/users.controllers';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // so AuthModule can use it if needed
})
export class UsersModule {}
