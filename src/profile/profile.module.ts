import { Module } from "@nestjs/common";
import { TypeOrmModule } from "src/database/typeorm-ex.module";
import { ProfileRepository } from "./profile.repository";
import { AuthModule } from "src/auth/auth.module";
import { ProfileContoller } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { UserRepository } from "src/auth/user.repository";

@Module(
    {
        imports: [
            TypeOrmModule.forCustomRepository([ProfileRepository]), AuthModule
        ],
        controllers: [ProfileContoller],
        providers: [ProfileService, UserRepository],
        exports: [ProfileService]
    }
) 
export class ProfileModule { }
