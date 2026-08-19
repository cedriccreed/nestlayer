import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTOs (Data Transfer Objects) describe the shape of the HTTP body.
// class-validator runs these rules in ValidationPipe before the controller
// method, so AuthService never sees a missing name or a 3-character password.
//
// @ApiProperty feeds Swagger the same fields: without it, /docs would show
// an empty body and frontend clients would have to guess the contract.
export class RegisterDto {
  @ApiProperty({
    description: 'Unique email used as the login identifier',
    example: 'ada@nestlayer.dev',
  })
  @IsEmail()
  email!: string;

  // 8+ characters is a minimum bar; hashing still happens in AuthService.
  @ApiProperty({
    description: 'Plain password; stored hashed, never returned',
    example: 'Str0ngPass!',
    minLength: 8,
  })
  @MinLength(8)
  password!: string;

  @ApiProperty({
    description: 'Public display name',
    example: 'Ada Lovelace',
  })
  @IsNotEmpty()
  name!: string;
}
