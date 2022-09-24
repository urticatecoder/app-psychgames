import { NestFactory } from "@nestjs/core";
import { GameModule } from "./game/game.module.js";

async function bootstrap() {
  const app = await NestFactory.create(GameModule);
  await app.listen(3001);
}
bootstrap();
