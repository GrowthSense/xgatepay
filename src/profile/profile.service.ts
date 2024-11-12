import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfileRepository } from "./profile.repository";
import { UserProfileDto } from "./dto/create-profile.dto";
import { User } from "src/auth/entities/users.entity";
import { CreateZicodeDto } from "./dto/create-zipcode.dto";
import { CreateCashTagDto } from "./dto/create-cashtag.dto";
import { In } from "typeorm";

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(ProfileRepository) private profileRepo: ProfileRepository) {}


    async getProfileById(userId: string): Promise<User> {
        const result = await this.profileRepo.findOne({ where: { id: userId } });


        if (!result) {
            throw new NotFoundException();
        }

        return result;
    }

    async updateProfileById(id: string, userProfileDto: UserProfileDto): Promise<User> {
        const existingUser = await this.getProfileById(id);

    const updatedUser = {
        ...existingUser,
        ...userProfileDto, // Spread userProfileDto to update the user profile
    };

    const user = await this.profileRepo.save(updatedUser); 
    return user;
    }

    async updateZipcodeById(id: string, createZipCodeDto: CreateZicodeDto): Promise<User> {
        const existingUser = await this.getProfileById(id);

    const updatedUser = {
        ...existingUser,
        ...createZipCodeDto,
    };

    const user = await this.profileRepo.save(updatedUser); 
    return user;
    }

    async updateCashtagById(id: string, createCashtagDto: CreateCashTagDto): Promise<User> {
        const existingUser = await this.getProfileById(id);

    const updatedUser = {
        ...existingUser,
        ...createCashtagDto,
    };

    const user = await this.profileRepo.save(updatedUser); 
    return user;
    }
async getAllUsers(page:number, perPage:number, isVerified:boolean){
    const limit=perPage||10;
    let skip=0;
    if(page>1){
        skip=limit*page-limit;
    }
        const [result,total]=await this.profileRepo.findAndCount({
            where:{isVerified:true},
            take:limit,
            skip:skip,
        });
        return {
            data:result,
            activePage:Number(page),
            itemsCountPerPage:Number(perPage),
            totalItemsCount:Number(total),
            totalPages:Math.ceil(total/limit)
        };
}

async getProfilesByUserIds(userIds: string[]): Promise<User[]> {
    // Fetch users based on their IDs
    const users = await this.profileRepo.find({
      where: {
        id: In(userIds),
      },
    });
    return users;
  }
}