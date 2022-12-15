import { NestFactory } from "@nestjs/core";
import { GameModule } from "./game/game.module.js";
import { ValidationPipe } from "@nestjs/common";
import mongoose from "mongoose";

async function bootstrap() {
  const app = await NestFactory.create(GameModule, {
    logger: console,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();

//mongoose.connect("mongodb+srv://keatonh:absolutelynot@cluster0.lw9inwu.mongodb.net/?retryWrites=true&w=majority");
mongoose.connect("mongodb+srv://bl275:bl275@cluster0.uumptd4.mongodb.net/?retryWrites=true&w=majority");
