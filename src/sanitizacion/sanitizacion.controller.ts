import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';
import { SanitizacionService } from './sanitizacion.service';
import { CreateSanitizacionDto } from './dto/create-sanitizacion.dto';
import { Multer } from 'multer';

@Controller()
export class SanitizacionController {
  constructor(private readonly sanitizacionService: SanitizacionService) {}

  @MessagePattern({ cmd: 'create_sanitizacion' })
  async create(data: { createDto: CreateSanitizacionDto; zipFile: Multer.File; pdfFile?: Multer.File }) {
    if (!data.zipFile) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Archivo ZIP es obligatorio para la sanitización',
      });
    }
    return await this.sanitizacionService.create(data.createDto, data.zipFile, data.pdfFile);
  }
}
