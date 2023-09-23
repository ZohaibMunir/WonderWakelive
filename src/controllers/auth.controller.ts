import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { signUpUserData } = await this.authService.signup(userData);
      const returnedData = {
        _id: signUpUserData?._id,
        email: signUpUserData?.email,
        userName: signUpUserData?.userName,
        displayName: signUpUserData?.displayName,
        gender: signUpUserData?.gender,
        active: signUpUserData?.active,
        isDeleted: signUpUserData?.isDeleted,
        createdAt: signUpUserData?.createdAt,
        updatedAt: signUpUserData?.updatedAt,
      };
      res.status(201).json({ data: returnedData, message: 'Successfully signed up' });
    } catch (error) {
      next(error);
    }
  };

  public resendEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { user } = await this.authService.resendEmail(userData?.email);

      res.status(201).json({ data: user, message: 'Resend Otp Email' });
    } catch (error) {
      next(error);
    }
  };

  public validateUserSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { cookie, updatedUser } = await this.authService.validateUserSignUp(userData?.email, userData?.otp);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(201).json({ data: updatedUser, message: 'Email Verified' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { cookie, findUser } = await this.authService.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
