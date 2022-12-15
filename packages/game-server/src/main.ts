import { NestFactory } from "@nestjs/core";
import { GameModule } from "./game/game.module.js";
import mongoose from "mongoose";

async function bootstrap() {
  const app = await NestFactory.create(GameModule, {
    logger: console
  });
  await app.listen(3001);
}
bootstrap();

//mongoose.connect("mongodb+srv://keatonh:absolutelynot@cluster0.lw9inwu.mongodb.net/?retryWrites=true&w=majority");
