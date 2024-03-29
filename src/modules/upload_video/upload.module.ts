import { Module } from '@nestjs/common';
import { UploadVideoService } from './upload.service';
import { UploadVideoController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  // import 
  imports:[
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'uploads');
        },
        filename: (req, file, cb) => {
          const fileExtName = file.mimetype.split('/')[1];
          const randomName = Date.now() + '_' + Math.round(Math.random() * 1e5);
          cb(null, `${randomName}.${fileExtName}`);
        }
      })
    })
  ],
  controllers: [UploadVideoController],
  providers: [UploadVideoService],
})
export class UploadVideoModule {}
