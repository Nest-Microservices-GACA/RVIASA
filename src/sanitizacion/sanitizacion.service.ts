import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import * as fsExtra from 'fs-extra';
import { join } from 'path';

@Injectable()
export class SanitizacionService {
  private readonly sanitizacionPath = '/sysx/bito/projects';

  async verify(createSanitizacionDto: {
    iduProject: string;
    zipFileName: string;
    pdfFileName: string;
    csvFileName: string;
  }) {
    const { iduProject, zipFileName, pdfFileName, csvFileName } = createSanitizacionDto;

    const zipPath = join(this.sanitizacionPath, zipFileName);
    const extractedFolderPath = zipPath.replace('.zip', '');

    try {
      // Verificar que el archivo ZIP exista
      if (!await fsExtra.pathExists(zipPath)) {
        throw new BadRequestException(`El archivo ZIP no existe en la ruta: ${zipPath}`);
      }

      // Verificar que la carpeta descomprimida exista
      if (!await fsExtra.pathExists(extractedFolderPath)) {
        throw new BadRequestException(`La carpeta descomprimida no existe en la ruta: ${extractedFolderPath}`);
      }

      // Verificar que el archivo PDF esté dentro de la carpeta descomprimida
      const pdfPath = join(extractedFolderPath, pdfFileName);
      if (!await fsExtra.pathExists(pdfPath)) {
        throw new BadRequestException(`El archivo PDF no existe en la ruta: ${pdfPath}`);
      }

      // Verificar que el archivo CSV esté dentro de la carpeta descomprimida
      const csvPath = join(extractedFolderPath, csvFileName);
      if (!await fsExtra.pathExists(csvPath)) {
        throw new BadRequestException(`El archivo CSV no existe en la ruta: ${csvPath}`);
      }

      return {
        message: 'Todos los archivos requeridos están presentes.',
        extractedFolderPath,
        pdfPath,
        csvPath,
      };
    } catch (error) {
      console.error('Error durante la verificación:', error.message);
      throw new InternalServerErrorException(`Error durante la verificación: ${error.message}`);
    }
  }
}
