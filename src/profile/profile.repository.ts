import { User } from "src/auth/entities/users.entity";
import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Repository } from "typeorm";

@CustomRepository(User)
export class ProfileRepository extends Repository<User>{}