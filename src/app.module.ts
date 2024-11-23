import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SanitizacionModule } from './sanitizacion/sanitizacion.module'; // Ruta correcta al módulo de sanitización
import { envs } from './config/envs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.db.host,
      port: envs.db.port,
      username: envs.db.username,
      password: envs.db.password,
      database: envs.db.database,
      autoLoadEntities: true,
      synchronize: false,
    }),
    SanitizacionModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
