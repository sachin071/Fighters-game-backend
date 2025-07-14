import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerselectwsModule } from './playerselectws/playerselectws.module';
import { LoginModule } from './login/login.module';
import { GamewsModule } from './gamews/gamews.module';
import { MobileplayerselectModule } from './mobileplayerselect/mobileplayerselect.module';

@Module({
  imports: [PlayerselectwsModule, LoginModule, GamewsModule, MobileplayerselectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
