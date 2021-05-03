import * as assert from "assert";
import { nanoid } from 'nanoid'
import { EntityRepository, Repository } from "typeorm";

import { User } from "../entity/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  createNewUserFromLine(lineUserId: string) {
    const user = new User();
    user.lineUserId = lineUserId;
    user.uuid = nanoid();
    return this.save(user);
  }

  async findUserByLineUserId(lineUserId: string): Promise<User | undefined> {
    const users = await this.find({ lineUserId });
    
    assert(
      users.length <= 1,
      "There is at most one user with a specific lineUserId"
    );

    return users[0]
  }
}
