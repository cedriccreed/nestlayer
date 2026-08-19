import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// DTOs (Data Transfer Objects) describe the shape of the HTTP body.
// class-validator runs these rules in ValidationPipe before the controller
// method, so AuthService never sees a missing name or a 3-character password.
export class RegisterDto {
  @IsEmail()
  email!: string;

  // 8+ characters is a minimum bar; hashing still happens in AuthService.
  @MinLength(8)
  password!: string;

  @IsNotEmpty()
  name!: string;
}
