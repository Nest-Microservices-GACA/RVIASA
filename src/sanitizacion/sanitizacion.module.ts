import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, resolve } from 'path';
import { SanitizacionService } from './sanitizacion.service';
import { SanitizacionController } from './sanitizacion.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: resolve('/sysx/bito/projects'),
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          callback(null, uniqueName);
        },
      }),
    }),
  ],
  controllers: [SanitizacionController],
  providers: [SanitizacionService],
})
export class SanitizacionModule {}
