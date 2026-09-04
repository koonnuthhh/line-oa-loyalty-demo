import { IsNumber, IsString  } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseUserDTO{
  @ApiProperty({example:'Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'})
  @IsString()
  userId: string;

  @ApiProperty({example:'Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'})
  @IsString()
  destination: string;
}

export class IsAdmin_User extends BaseUserDTO{
  @ApiProperty({example:'null'})
  IsAdmin?:boolean|null;
}

export class BranchId_User extends BaseUserDTO{
  @ApiProperty({example:'8o3Y'})
  @IsString()
  branchId:string;
}

export class BranchId_And_IsAdmin_User extends BaseUserDTO{
  @ApiProperty({example:'8o3Y'})
  @IsString()
  branchId:string;

  @ApiProperty({example:'null'})
  IsAdmin?:boolean|null;
}

export class BranchId_And_Username extends BaseUserDTO{
  @ApiProperty({example:'V1001'})
  @IsString()
  branchId:string;

  @ApiProperty({example:'demo-user'})
  @IsString()
  username:string;
}