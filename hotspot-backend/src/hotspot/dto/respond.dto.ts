import { ApiProperty } from '@nestjs/swagger';

export class WifiCredentialResponse {
  @ApiProperty({ example: 'wifi-user-1' })
  username: string;

  @ApiProperty({ example: 'securepass123' })
  password: string;

  @ApiProperty({example:'4h'})
  Time:string

}

export class IsAdminResponse {
  @ApiProperty({ example: true })
  isAdmin: boolean;
}

export class TextOnlyResponse {
  @ApiProperty({ example: 'Text respond here' })
  Text: string;
}

export class LogsResponse {
  @ApiProperty({ type: [String], example: ['ID:1 Date:25/06/2568 Time:11:57 Username:abc Branch:Main(1000) Company:XYZ'] })
  logs: string[];
}
