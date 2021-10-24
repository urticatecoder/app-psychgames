import { Type } from "class-transformer";
import { IsInt, IsPositive, IsUUID, ValidateNested } from "class-validator";
import type { PlayerModel } from "./player.model";

export class LobbyAvatarRequest {
  type: "lobby_avatar";

  @IsInt()
  @IsPositive()
  avatar: number;
}

class Round {
  @IsInt()
  @IsPositive()
  round: number;
}

export class GameOneTurnRequest extends Round {
  type: "game-one_turn";

  @IsUUID("4", { each: true })
  playersSelected: PlayerModel.Id[];
}

class TokenDistribution {
  @IsInt()
  @IsPositive()
  compete: number;

  @IsInt()
  @IsPositive()
  invest: number;

  @IsInt()
  @IsPositive()
  keep: number;
}

export class GameTwoTurnRequest extends Round {
  type: "game-two_turn";

  @ValidateNested()
  @Type(() => TokenDistribution)
  tokenDistribution: TokenDistribution;
}
