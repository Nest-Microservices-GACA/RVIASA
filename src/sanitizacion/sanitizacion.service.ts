import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { CreateSanitizacionDto } from './dto/create-sanitizacion.dto';
import { UpdateSanitizacionDto } from './dto/update-sanitizacion.dto';

@Injectable()
export class SanitizacionService {
  private sanitizaciones: any[] = [];

  private encryptionService = {
    encrypt: (data: string) => (data ? Buffer.from(data).toString('base64') : null),
    decrypt: (data: string) => (data ? Buffer.from(data, 'base64').toString('utf8') : null),
  };

  create(createSanitizacionDto: CreateSanitizacionDto) {
    const { idu_proyecto, num_accion, numero_empleado, path_project } = createSanitizacionDto;

    if (!idu_proyecto || !num_accion || !numero_empleado || !path_project) {
      throw new BadRequestException(
        'Todos los campos (idu_proyecto, num_accion, numero_empleado, path_project) son obligatorios.',
      );
    }

    try {
      if (num_accion === 2) {
        // Derivar el nombre base dinámicamente desde el path_project
        const pathParts = path_project.split('/');
        const nameBase = pathParts[pathParts.length - 1].replace(`${idu_proyecto}_`, ''); // Remover el ID si ya está presente

        // Definir nombres esperados de los archivos
        const pdfFileName = `checkmarx_${idu_proyecto}_${nameBase}.pdf`;
        const csvFileNameTot = `checkmarx_tot_${idu_proyecto}_${nameBase}.csv`;
        const csvFileName = `checkmarx_${idu_proyecto}_${nameBase}.csv`;

        // Rutas completas
        const pdfPath = join(path_project, pdfFileName);
        const csvPathTot = join(path_project, csvFileNameTot);
        const csvPath = join(path_project, csvFileName);

        // Verificar existencia de archivos
        const pdfExists = fs.existsSync(pdfPath);
        const csvTotExists = fs.existsSync(csvPathTot);
        const csvExists = fs.existsSync(csvPath);

        if (!pdfExists || !csvTotExists || !csvExists) {
          return {
            starter: false,
            message: `Faltan archivos en el directorio proporcionado: ${
              !pdfExists ? `PDF (${pdfFileName}) ` : ''
            }${!csvTotExists ? `CSV (${csvFileNameTot}) ` : ''}${!csvExists ? `CSV (${csvFileName})` : ''}`,
          };
        }

        // Crear registro de sanitización
        const nuevaSanitizacion = {
          id: this.sanitizaciones.length + 1,
          idu_proyecto,
          num_accion,
          numero_empleado,
          path_project: this.encryptionService.encrypt(path_project),
          pdfFileName: this.encryptionService.encrypt(pdfFileName),
          csvFileNameTot: this.encryptionService.encrypt(csvFileNameTot),
          csvFileName: this.encryptionService.encrypt(csvFileName),
        };

        this.sanitizaciones.push(nuevaSanitizacion);

        return {
          isProcessStarted: true,
          message: 'Proceso IA Iniciado Correctamente',
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
      idu_proyecto: sanitizacion.idu_proyecto,
      numero_empleado: sanitizacion.numero_empleado,
      path_project: this.encryptionService.decrypt(sanitizacion.path_project),
    }));
  }

  findOne(id: number) {
    const sanitizacion = this.sanitizaciones.find((item) => item.id === id);

    if (!sanitizacion) {
      throw new NotFoundException(`Sanitización con ID ${id} no encontrada`);
    }

    return {
      idu_proyecto: sanitizacion.idu_proyecto,
      numero_empleado: sanitizacion.numero_empleado,
      path_project: this.encryptionService.decrypt(sanitizacion.path_project),
    };
  }

  update(id: number, updateSanitizacionDto: UpdateSanitizacionDto) {
    const sanitizacionIndex = this.sanitizaciones.findIndex((item) => item.id === id);

    if (sanitizacionIndex === -1) {
      throw new NotFoundException(`Sanitización con ID ${id} no encontrada`);
    }

    const sanitizacion = this.sanitizaciones[sanitizacionIndex];
    const { path_project } = updateSanitizacionDto;

    const actualizada = {
      ...sanitizacion,
      path_project: path_project ? this.encryptionService.encrypt(path_project) : sanitizacion.path_project,
    };

    this.sanitizaciones[sanitizacionIndex] = actualizada;

    return {
      message: 'Sanitización actualizada correctamente',
      sanitizacion: {
        idu_proyecto: actualizada.idu_proyecto,
        numero_empleado: actualizada.numero_empleado,
        path_project: this.encryptionService.decrypt(actualizada.path_project),
      },
    };
  }

  remove(id: number) {
    const sanitizacionIndex = this.sanitizaciones.findIndex((item) => item.id === id);

    if (sanitizacionIndex === -1) {
      throw new NotFoundException(`Sanitización con ID ${id} no encontrada`);
    }

    const idu_proyecto = this.sanitizaciones[sanitizacionIndex].idu_proyecto;
    this.sanitizaciones.splice(sanitizacionIndex, 1);

    return {
      message: `Sanitización con ID ${id} eliminada correctamente`,
      idu_proyecto,
    };
  }
}
