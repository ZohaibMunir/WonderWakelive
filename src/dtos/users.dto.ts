import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public platform: string;

  // @IsString()
  // public userName?: string | undefined;

  // @IsString()
  // public displayName?: string | undefined;

  // @IsString()
  // public gender?: string | undefined;

  // @IsString()
  // public FcmToken?: string | undefined;

  // @IsBoolean()
  // public active?: boolean | undefined;

  // @IsString()
  // public otp?: string | undefined;

  // @IsBoolean()
  // public isDeleted?: Boolean | undefined;
}
