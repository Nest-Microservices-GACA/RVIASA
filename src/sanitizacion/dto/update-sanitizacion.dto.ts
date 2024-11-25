import { PartialType } from '@nestjs/mapped-types';
import { CreateSanitizacionDto } from './create-sanitizacion.dto';

export class UpdateSanitizacionDto extends PartialType(CreateSanitizacionDto) {
  id: number;
}
