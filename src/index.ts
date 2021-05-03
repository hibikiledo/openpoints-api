import "reflect-metadata";
import { createConnection, getCustomRepository } from "typeorm";

import axios from "axios";
import * as Koa from "koa";
import * as Router from "@koa/router";
import * as cors from "@koa/cors";
import * as bodyParser from "koa-bodyparser";

import { UserRepository } from "./repository/UserRepository";

const app = new Koa();
const router = new Router();

router.post("/auth/connect/line", async (ctx) => {
  try {
    await createConnection();
    const userRepository = getCustomRepository(UserRepository);

    const verifyResponse = await axios({
      method: "POST",
      url: "https://api.line.me/oauth2/v2.1/verify",
      data: `id_token=${ctx.request.body.idToken}&client_id=1655949010`,
    });

    const lineUserId = verifyResponse.data.sub;

    const user = await userRepository.findUserByLineUserId(lineUserId);
    
    if (user) {
      ctx.response.status = 204;
    } else {
      await userRepository.createNewUserFromLine(lineUserId);
      ctx.response.status = 204;
    }
  } catch (err) {
    console.error(err);
  }
});

app
  .use(bodyParser())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000);
