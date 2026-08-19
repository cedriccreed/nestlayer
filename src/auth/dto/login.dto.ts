import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Documenting the login body in Swagger lets consumers try the endpoint
// from /docs without reading the source. Descriptions and examples here
// become the public contract for the request payload.
export class LoginDto {
  @ApiProperty({
    description: 'Account email',
    example: 'ada@nestlayer.dev',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Account password',
    example: 'Str0ngPass!',
  })
  @IsNotEmpty()
  password!: string;
}
