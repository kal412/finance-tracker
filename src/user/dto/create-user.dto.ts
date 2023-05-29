import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @IsLowercase()
  @ApiProperty({ required: true, example: 'test' })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  @ApiProperty({ required: true, example: 'test@gmail.com' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'minLength-{"ln":6,"count":6}',
  })
  @MaxLength(20, {
    message: 'maxLength-{"ln":20,"count":20}',
  })
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/,
    {
      message:
        'password should contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character',
    },
  )
  @ApiProperty({ required: true, example: 'Test@123' })
  password: string;

  @ApiProperty({ required: false })
  image: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, example: 20000 })
  expenditureBudget: number;
}
