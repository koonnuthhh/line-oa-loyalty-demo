import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';



export class ContentRequestDTO {
  @ApiProperty({example:'resetWifi'})
  @IsString()
  request: 'usageLog' | 'resetWifi'; // or use string if dynamic
}


/*export class ContentWifiPassDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
*/


export class ContentDateDTO {
  @ApiProperty({example:'MM/DD/YYYY'})
  @IsString()
  formattedDate: string;  
}
