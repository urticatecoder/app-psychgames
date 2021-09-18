import { Module } from "@nestjs/common";
import { GameGateway } from "./controllers/game/game.gateway";
import { GameFactory } from "./services/game-factory/game-factory";
import { GameFactoryService } from "./services/game-factory/game-factory.service";
import { GameManagerService } from "./services/game-manager/game-manager.service";

@Module({
  controllers: [GameGateway],
  providers: [
    GameManagerService,
    {
      provide: GameFactory,
      useClass: GameFactoryService,
    },
  ],
})
export class GameModule {}
