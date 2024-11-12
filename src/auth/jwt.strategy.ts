import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt,Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { JwtPayLoad } from "./jwt-payload.interfaces";
import { AuthService } from "./auth.service";
import { User } from "./entities/users.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private authService:AuthService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:process.env.JWT_SECRET,
        });
    }
async validate (payload:{userId:string}){
    return {
        userId:payload.userId,
    };
}
async validates(payload:JwtPayLoad):Promise<User>{
    const {iss}=payload;
    const user=await this.authService.findByUserId(iss);
    if(!user)throw new UnauthorizedException();

    return user;
}

}