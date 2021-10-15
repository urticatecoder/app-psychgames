import { Module } from "@nestjs/common";
import { GameGateway } from "./controllers/game/game.gateway.js";
import { GameFactory } from "./services/game-factory/game-factory.js";
import { GameFactoryService } from "./services/game-factory/game-factory.service.js";
import { GameManagerService } from "./services/game-manager/game-manager.service.js";

@Module({
  providers: [
    GameGateway,
    GameManagerService,
    {
      provide: GameFactory,
      useClass: GameFactoryService,
    },
  ],
})
export class GameModule {}
