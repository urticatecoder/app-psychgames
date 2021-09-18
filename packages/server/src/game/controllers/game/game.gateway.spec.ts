import { Test, TestingModule } from "@nestjs/testing";
import { GameManagerService } from "../../services/game-manager/game-manager.service.js";
import { GameGateway } from "./game.gateway.js";

// TODO: write tests
describe("GameGateway", () => {
  let gateway: GameGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameManagerService, GameGateway],
    }).compile();

    gateway = module.get<GameGateway>(GameGateway);
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });
});
