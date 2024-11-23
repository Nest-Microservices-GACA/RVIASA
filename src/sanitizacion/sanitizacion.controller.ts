import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SanitizacionService } from './sanitizacion.service';

@Controller()
export class SanitizacionController {
  constructor(private readonly sanitizacionService: SanitizacionService) {}

  @MessagePattern('verifySanitizacion') 
  verify(@Payload() createDto: { iduProject: string; zipFileName: string; pdfFileName: string; csvFileName: string }) {
    return this.sanitizacionService.verify(createDto);
  }
}
