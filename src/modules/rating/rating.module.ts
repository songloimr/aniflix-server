import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingSchema,Rating } from 'src/schemas/rating.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rating.name, schema: RatingSchema },
    ])
  ],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
