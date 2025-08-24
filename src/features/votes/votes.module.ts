import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesController } from './controllers/votes.controller';
import { Vote } from './entites/votes.entity';
import { VotesService } from './services/votes.service';
import { Post } from '../posts/entites/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Post])],
  providers: [VotesService],
  controllers: [VotesController],
  exports: [VotesService],
})
export class VotesModule {}
