import { InternalServerErrorException } from "@nestjs/common";
import { Repository } from "typeorm";
import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { User } from "./entities/users.entity";
import { CreateUserSignUpDto } from "./dto/create-user-signup.dto";
import * as argon2 from "argon2";

@CustomRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(createUserSignUpDto: CreateUserSignUpDto, otp: string, pin: string, publicKey:string, secretKey:string): Promise<User> {
        const { email, phonenumber } = createUserSignUpDto;
        const hashedPin = await this.hashPin(pin);
        const hashedSecret=await argon2.hash(secretKey)

        const user = this.create({ email, phonenumber, otp, pin: hashedPin ,publicKey, secretKey});
        try {
            await this.save(user);
            return user;
        } catch (error) {

            throw new InternalServerErrorException("User already exist");
        }
    }

    private async hashPin(password: string): Promise<string> {
        const options = {
          type: argon2.argon2id,
          memoryCost: 2048,
          timeCost: 2,
          parallelism: 1,
          hashLength: 32,
          saltLength: 16,
        };
    
        return await argon2.hash(password, options);
      }
    


}