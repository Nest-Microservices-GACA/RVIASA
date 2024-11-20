import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('actualizaciones')
export class Actualizacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  ruta: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
}
