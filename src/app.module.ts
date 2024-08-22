import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { CardModule } from './card/card.module';
import { BoxModule } from './box/box.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { CategoriesModule } from './categories/categories.module';
// import { join } from 'path';
// import { ServeStaticModule } from '@nestjs/serve-static';
import { ChatModule } from './chat/chat.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'files') }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    CardModule,
    BoxModule,
    CategoriesModule,
    SharedModule,
    AuthModule,
    UserModule,
    ChatModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
