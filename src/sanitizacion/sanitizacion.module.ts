import { Module } from '@nestjs/common';
import { SanitizacionService } from './sanitizacion.service';
import { SanitizacionController } from './sanitizacion.controller';

@Module({
  controllers: [SanitizacionController],
  providers: [SanitizacionService],
})
export class SanitizacionModule {}
