import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost', 
      port: envs.port, 
    },
  });

  console.log(`Microservicio RVIASA corriendo en localhost:${envs.port}`);
  await app.listen();
}

bootstrap();
