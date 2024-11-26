import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      host: 'localhost', 
      servers: envs.natsServers
    },
  });

  console.log(`Microservicio RVIASA corriendo en localhost:${envs.port}`);
  await app.listen();
}

bootstrap();
