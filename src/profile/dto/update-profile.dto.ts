import { PartialType } from '@nestjs/swagger';
import { UserProfileDto } from './create-profile.dto';

export class UpdateUserDto extends PartialType(UserProfileDto) {}
