import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CardModule } from './card/card.module';
import { BoxModule } from './box/box.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { FilesModule } from './files/files.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'files') }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    CardModule,
    BoxModule,
    SharedModule,
    AuthModule,
    UserModule,
    FilesModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
