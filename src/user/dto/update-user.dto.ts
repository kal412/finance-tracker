import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty({ required: false })
  image: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: true, example: 30000 })
  expenditureBudget: number;
}
