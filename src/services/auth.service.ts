import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { generateOTP } from '@utils/Otp';
import { sendMail } from '@utils/sendMail';

class AuthService {
  public users = userModel;

  public async signup(userData: CreateUserDto): Promise<{ signUpUserData: User }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const otpGenerated = generateOTP();
    const signUpUserData: User = await this.users.create({ ...userData, password: hashedPassword, otp: otpGenerated });
    try {
      await sendMail({
        to: userData?.email,
        OTP: otpGenerated,
      });
      // return [true, newUser];
    } catch (error) {
      throw new HttpException(409, `Error in sending the email`);
    }

    return { signUpUserData };
  }

  public async resendEmail(email: any) {
    const user: User = await this.users.findOne({
      email,
    });
    if (!user) throw new HttpException(409, `This email ${email} was not found`);

    try {
      await sendMail({
        to: user?.email,
        OTP: user?.otp,
      });
      // return [true, newUser];
    } catch (error) {
      throw new HttpException(409, `Error in sending the email`);
    }

    return { user };
  }

  public async validateUserSignUp(email: any, otp: any) {
    const user: User = await this.users.findOne({
      email,
    });
    if (!user) throw new HttpException(409, `This email ${email} was not found`);

    if (user && user.otp !== otp) {
      throw new HttpException(409, 'Invalid OTP');
    }
    const updatedUser = await this.users.findByIdAndUpdate(user._id, {
      $set: { active: true },
    });

    const tokenData = this.createToken(updatedUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, updatedUser };
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
