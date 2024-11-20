import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';
import * as fsExtra from 'fs-extra';
import { join } from 'path';
import { CreateSanitizacionDto } from './dto/create-sanitizacion.dto';
import { Multer } from 'multer';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SanitizacionService {
  private readonly sanitizacionPath = '/sanitizacion/projects';

  async create(createDto: CreateSanitizacionDto, zipFile: Multer.File, pdfFile?: Multer.File) {
    const uniqueTempFolderName = `temp-${uuid()}`;
    const tempFolderPath = join(zipFile.destination, uniqueTempFolderName);
    const tempZipPath = join(tempFolderPath, zipFile.filename);

    try {
      if (!pdfFile) {
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Archivo PDF es obligatorio para la sanitización',
        });
      }

      await fsExtra.ensureDir(tempFolderPath);
      await fsExtra.move(zipFile.path, tempZipPath);

      // Verifica si el archivo ZIP se movió correctamente
      const fileExists = await fsExtra.pathExists(tempZipPath);
      if (!fileExists) {
        throw new RpcException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `El archivo ZIP no se movió correctamente a ${tempZipPath}`,
        });
      }

      // Crear carpeta para sanitización
      const sanitizationFolder = join(this.sanitizacionPath, `sanitized-${uuid()}`);
      await fsExtra.ensureDir(sanitizationFolder);

      // Procesar el archivo ZIP
      await this.processZipFile(tempZipPath, sanitizationFolder);

      // Procesar el archivo PDF
      const pdfPath = await this.processPdfFile(pdfFile, sanitizationFolder);

      return {
        message: 'Sanitización completada con éxito',
        sanitizationFolder,
        pdfPath,
      };
    } catch (error) {
      await fsExtra.remove(tempFolderPath);
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error durante la sanitización: ${error.message}`,
      });
    }
  }

  private async processZipFile(zipPath: string, outputPath: string) {
    try {
      // Simular descompresión
      await fsExtra.copy(zipPath, join(outputPath, 'unzipped'));
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error al descomprimir el archivo ZIP: ${error.message}`,
      });
    }
  }

  private async processPdfFile(pdfFile: Multer.File, outputPath: string): Promise<string> {
    const pdfDestination = join(outputPath, pdfFile.filename);
    try {
      await fsExtra.move(pdfFile.path, pdfDestination);
      return pdfDestination;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error al mover el archivo PDF: ${error.message}`,
      });
    }
  }
}
