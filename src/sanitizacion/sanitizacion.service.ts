import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateSanitizacionDto } from './dto/create-sanitizacion.dto';
import { UpdateSanitizacionDto } from './dto/update-sanitizacion.dto';

@Injectable()
export class SanitizacionService {
  private sanitizaciones: any[] = []; 

  private encryptionService = {
    encrypt: (data: string) => (data ? Buffer.from(data).toString('base64') : null),
    decrypt: (data: string) => (data ? Buffer.from(data, 'base64').toString('utf8') : null),
  };

  create(createSanitizacionDto: CreateSanitizacionDto, num_accion: number) {
    const { iduProject, zipFileName, pdfFileName, csvFileName, nom_aplicacion } = createSanitizacionDto;

    if (!iduProject || !zipFileName || !pdfFileName || !csvFileName || !nom_aplicacion) {
      throw new BadRequestException(
        'Todos los campos (iduProject, zipFileName, pdfFileName, csvFileName, nom_aplicacion) son obligatorios.',
      );
    }

    try {
      if (num_accion === 2) {
        const nuevaSanitizacion = {
          id: this.sanitizaciones.length + 1,
          iduProject,
          zipFileName: this.encryptionService.encrypt(zipFileName),
          pdfFileName: this.encryptionService.encrypt(pdfFileName),
          csvFileName: this.encryptionService.encrypt(csvFileName),
          nom_aplicacion: this.encryptionService.encrypt(nom_aplicacion),
          num_accion,
        };

        this.sanitizaciones.push(nuevaSanitizacion);

        return {
          message: 'Sanitización creada correctamente',
          sanitizacion: {
            ...nuevaSanitizacion,
            zipFileName: this.encryptionService.decrypt(nuevaSanitizacion.zipFileName),
            pdfFileName: this.encryptionService.decrypt(nuevaSanitizacion.pdfFileName),
            csvFileName: this.encryptionService.decrypt(nuevaSanitizacion.csvFileName),
            nom_aplicacion: this.encryptionService.decrypt(nuevaSanitizacion.nom_aplicacion),
          },
        };
      } else {
        throw new BadRequestException(`Acción num_accion ${num_accion} no implementada.`);
      }
    } catch (error) {
      throw new BadRequestException(`Error al crear la sanitización: ${error.message}`);
    }
  }

  findAll() {
    return this.sanitizaciones.map((sanitizacion) => ({
      ...sanitizacion,
      zipFileName: this.encryptionService.decrypt(sanitizacion.zipFileName),
      pdfFileName: this.encryptionService.decrypt(sanitizacion.pdfFileName),
      csvFileName: this.encryptionService.decrypt(sanitizacion.csvFileName),
      nom_aplicacion: this.encryptionService.decrypt(sanitizacion.nom_aplicacion),
    }));
  }

  findOne(id: number) {
    const sanitizacion = this.sanitizaciones.find((item) => item.id === id);

    if (!sanitizacion) {
      throw new NotFoundException(`Sanitización con ID ${id} no encontrada`);
    }

    return {
      ...sanitizacion,
      zipFileName: this.encryptionService.decrypt(sanitizacion.zipFileName),
      pdfFileName: this.encryptionService.decrypt(sanitizacion.pdfFileName),
      csvFileName: this.encryptionService.decrypt(sanitizacion.csvFileName),
      nom_aplicacion: this.encryptionService.decrypt(sanitizacion.nom_aplicacion),
    };
  }

  update(id: number, updateSanitizacionDto: UpdateSanitizacionDto, num_accion: number) {
    const sanitizacionIndex = this.sanitizaciones.findIndex((item) => item.id === id);

    if (sanitizacionIndex === -1) {
      throw new NotFoundException(`Sanitización con ID ${id} no encontrada`);
    }

    if (num_accion === 2) {
      const sanitizacion = this.sanitizaciones[sanitizacionIndex];

      const actualizada = {
        ...sanitizacion,
        ...updateSanitizacionDto,
        zipFileName: this.encryptionService.encrypt(updateSanitizacionDto.zipFileName || sanitizacion.zipFileName),
        pdfFileName: this.encryptionService.encrypt(updateSanitizacionDto.pdfFileName || sanitizacion.pdfFileName),
        csvFileName: this.encryptionService.encrypt(updateSanitizacionDto.csvFileName || sanitizacion.csvFileName),
      };

      this.sanitizaciones[sanitizacionIndex] = actualizada;

      return {
        message: 'Sanitización actualizada correctamente',
        sanitizacion: {
          ...actualizada,
          zipFileName: this.encryptionService.decrypt(actualizada.zipFileName),
          pdfFileName: this.encryptionService.decrypt(actualizada.pdfFileName),
          csvFileName: this.encryptionService.decrypt(actualizada.csvFileName),
        },
      };
    } else {
      throw new BadRequestException(`Acción num_accion ${num_accion} no soportada en actualización.`);
    }
  }

  remove(id: number) {
    const sanitizacionIndex = this.sanitizaciones.findIndex((item) => item.id === id);

    if (sanitizacionIndex === -1) {
      throw new NotFoundException(`Sanitización con ID ${id} no encontrada`);
    }

    this.sanitizaciones.splice(sanitizacionIndex, 1);

    return { message: `Sanitización con ID ${id} eliminada correctamente` };
  }
}
