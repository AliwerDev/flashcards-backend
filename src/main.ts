import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });

  app.enableCors({
    origin: [
      'https://flashcardes.vercel.app',
      'https://cards.scripter.uz',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // if you need to support cookies or HTTP authentication
  });

  const config = new DocumentBuilder()
    .setTitle('Laitner System Flashcards')
    .setDescription(
      'It is a simple implementation of the principle of spaced repetition, where cards are reviewed at increasing intervals. In the Leitner system, correctly answered cards are advanced to the next, less frequent box, while incorrectly answered cards return to the first box.',
    )
    .build();

  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
