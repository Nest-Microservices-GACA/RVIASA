import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SanitizacionService } from './sanitizacion.service';
import { CreateSanitizacionDto } from './dto/create-sanitizacion.dto';
import { UpdateSanitizacionDto } from './dto/update-sanitizacion.dto';

@Controller()
export class SanitizacionController {
  private readonly logger = new Logger(SanitizacionController.name);

  constructor(private readonly sanitizacionService: SanitizacionService) {}

  @MessagePattern('createSanitizacion')
  async create(@Payload() createSanitizacionDto: CreateSanitizacionDto) {
    try {
      this.logger.log(`Datos recibidos para crear sanitización: ${JSON.stringify(createSanitizacionDto)}`);
      const result = await this.sanitizacionService.create(createSanitizacionDto);
      this.logger.log(`Sanitización creada exitosamente: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al crear sanitización: ${error.message}`, error.stack);
      throw error;
    }
  }

  @MessagePattern('findAllSanitizacion')
  async findAll() {
    try {
      this.logger.log('Recibiendo solicitud para obtener todas las sanitizaciones.');
      const result = await this.sanitizacionService.findAll();
      this.logger.log(`Sanitizaciones obtenidas exitosamente: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al obtener sanitizaciones: ${error.message}`, error.stack);
      throw error;
    }
  }

  @MessagePattern('findOneSanitizacion')
  async findOne(@Payload() id: number) {
    try {
      this.logger.log(`Recibiendo solicitud para obtener sanitización con ID: ${id}`);
      const result = await this.sanitizacionService.findOne(id);
      this.logger.log(`Sanitización obtenida exitosamente: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al obtener sanitización con ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @MessagePattern('updateSanitizacion')
  async update(@Payload() updateSanitizacionDto: UpdateSanitizacionDto) {
    try {
      this.logger.log(`Recibiendo solicitud para actualizar sanitización: ${JSON.stringify(updateSanitizacionDto)}`);
      const result = await this.sanitizacionService.update(updateSanitizacionDto.id, updateSanitizacionDto);
      this.logger.log(`Sanitización actualizada exitosamente: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al actualizar sanitización: ${error.message}`, error.stack);
      throw error;
    }
  }

  @MessagePattern('removeSanitizacion')
  async remove(@Payload() id: number) {
    try {
      this.logger.log(`Recibiendo solicitud para eliminar sanitización con ID: ${id}`);
      const result = await this.sanitizacionService.remove(id);
      this.logger.log(`Sanitización eliminada exitosamente con ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al eliminar sanitización con ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
