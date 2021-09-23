import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @Length(3)
  name: string;

  @IsEmail()
  email:string;

  @Length(6)
  password: string;
}
