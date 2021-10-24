import { ClassConstructor, Type } from "class-transformer";
import {
  Allow,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import type { GameTwoModel } from "./game.model";
import type { PlayerModel } from "./player.model";

/** Game negotiation requests **/

export class EnterGameRequest {
  @IsUUID("4")
  @IsOptional()
  id?: PlayerModel.Id;
}

class PlayerMetadata implements PlayerModel.PlayerMetadata {
  @IsString()
  @IsOptional()
  prolificId?: string;

  @IsString()
  @IsOptional()
  lobbyId?: string;
}

export class StartGameRequest {
  @ValidateNested()
  @IsOptional()
  @Type(() => PlayerMetadata)
  playerMetadata?: PlayerMetadata;
}

/** Game actions **/
export class LobbyAvatarRequest {
  @Allow()
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
  @Allow()
  type: "game-one_turn";

  @IsUUID("4", { each: true })
  playersSelected: PlayerModel.Id[];
}

class TokenDistribution implements GameTwoModel.TokenDistribution {
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
  @Allow()
  type: "game-two_turn";

  @ValidateNested()
  @Type(() => TokenDistribution)
  tokenDistribution: TokenDistribution;
}

export const requestTypes: { [key: string]: ClassConstructor<unknown> } = {
  lobby_avatar: LobbyAvatarRequest,
  "game-one_turn": GameOneTurnRequest,
  "game-two_turn": GameTwoTurnRequest,
};
