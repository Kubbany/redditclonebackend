import { Module, Global } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { configureCloudinary } from './cloudinary.config';

@Global()
@Module({
  providers: [
    CloudinaryService,
    {
      provide: 'CLOUDINARY',
      useFactory: () => configureCloudinary(),
    },
  ],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
