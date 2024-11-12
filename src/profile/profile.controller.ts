import { Body, Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ProfileService } from "./profile.service";
import { User } from "src/auth/entities/users.entity";
import { UserProfileDto } from "./dto/create-profile.dto";
import { CreateZicodeDto } from "./dto/create-zipcode.dto";
import { CreateCashTagDto } from "./dto/create-cashtag.dto";

@ApiTags('Profiles')
@Controller('profile')
export class ProfileContoller{
    constructor(private profileService:ProfileService){}

    @Get('/:id')
    getProfileById(@Param('id') userId: string): Promise<User> {
        return this.profileService.getProfileById(userId);
    }

    @Patch('/:id/user')
    async updateProfileById(@Param('id') id: string, @Body() userProfileDto: UserProfileDto): Promise<any> {
      const updatedProfile = await this.profileService.updateProfileById(id, userProfileDto);
      return updatedProfile;
    }

    @Patch('/:id/zipcode')
    async updateZipcodeById(@Param('id') id: string, @Body() createzipcodedto: CreateZicodeDto): Promise<any> {
      const updatedProfile = await this.profileService.updateZipcodeById(id, createzipcodedto);
      return updatedProfile;
    }

    @Patch('/:id/cashtag')
    async updateCashtagById(@Param('id') id: string, @Body() createcashtagdto: CreateCashTagDto): Promise<any> {
      const updatedProfile = await this.profileService.updateCashtagById(id, createcashtagdto);
      return updatedProfile;
    }

    @Get()
    async getAllUsers(@Query('page') page:string, @Query('perPage') perPage:string , @Query('isVerified') isVerified:boolean){
      return await this.profileService.getAllUsers(+page, +perPage, isVerified);
    }
}