import { Test, TestingModule } from "@nestjs/testing";
import { GameManagerService } from "../../services/game-manager/game-manager.service";
import { GameGateway } from "./game.gateway";

// TODO: write tests
describe("GameGateway", () => {
  let gateway: GameGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameGateway],
      providers: [GameManagerService],
    }).compile();

    gateway = module.get<GameGateway>(GameGateway);
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });
});
