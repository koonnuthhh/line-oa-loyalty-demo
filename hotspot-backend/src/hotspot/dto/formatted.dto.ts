import { Type } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseUserDTO,
  BranchId_User,
  IsAdmin_User,
  BranchId_And_Username
} from './baseUser.dto';

import {
  ContentRequestDTO,
  ContentDateDTO
} from './context.dto';


//Recive Json
export class CheckAdminDTO{

 @ApiProperty({type:() => IsAdmin_User})
 @ValidateNested()
 @Type(()=>IsAdmin_User)
 user:IsAdmin_User;
}

export class GetLogsDTO{
    @ApiProperty({type:() => BranchId_User})
    @ValidateNested()
    @Type(()=>BranchId_User)
    user:BranchId_User;

    @ApiProperty({type:() => ContentRequestDTO})
    @ValidateNested()
    @Type(()=>ContentRequestDTO)
    content:ContentRequestDTO;

}

export class GetWifiDTO{
  @ApiProperty({type:() => BranchId_And_Username})
  @ValidateNested()
  @Type(()=>BranchId_And_Username)
  user:BranchId_And_Username;

  @ApiProperty({type:() => ContentDateDTO})
  @ValidateNested()
  @Type(()=>ContentDateDTO)
  content:ContentDateDTO;
}

export class ResetWifiDTO{
  @ApiProperty({type:() => BranchId_User})
  @ValidateNested()
  @Type(()=>BranchId_User)
  user:BranchId_User;

  @ApiProperty({type:() => ContentRequestDTO})
  @ValidateNested()
  @Type(()=>ContentRequestDTO)
  content:ContentRequestDTO;
}
