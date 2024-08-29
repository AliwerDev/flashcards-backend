import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import appConfig from 'config';

// MODULES
import { SharedModule } from 'src/modules/shared/shared.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CardModule } from 'src/modules/card/card.module';
import { BoxModule } from 'src/modules/box/box.module';
import { UserModule } from 'src/modules/user/user.module';
import { AppController } from './app.controller';
import { CategoryModule } from 'src/modules/category/category.module';
import { ChatModule } from 'src/modules/chat/chat.module';
import { StatisticsModule } from 'src/modules/statistics/statistics.module';
import { EmailModule } from 'src/modules/email/email.module';
import { TopicModule } from 'src/modules/topic/topic.module';
import { SubTopicModule } from 'src/modules/sub-topic/sub-topic.module';
import { WordModule } from 'src/modules/word/word.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'files'),
      serveRoot: '/static',
    }),
    ConfigModule.forRoot(),
    CacheModule.register(appConfig.defaultCacheConfiguration),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    CardModule,
    BoxModule,
    CategoryModule,
    SharedModule,
    AuthModule,
    UserModule,
    ChatModule,
    StatisticsModule,
    EmailModule,
    TopicModule,
    SubTopicModule,
    WordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
