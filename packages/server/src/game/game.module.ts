import { Module } from "@nestjs/common";
import { GameGateway } from "./controllers/game/game.gateway";
import { GameManagerService } from "./services/game-manager/game-manager.service";

@Module({
  controllers: [GameGateway],
  providers: [GameManagerService],
})
export class GameModule {}
