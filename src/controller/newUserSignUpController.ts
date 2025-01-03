import { Request, Response } from 'express';
import { signUp } from '../services/new_User_Service';
import { ISignUp } from '../interfaces/userSignup';

export const newUserSignup = async (req: Request, res: Response) => {
  const { email, password, name }: ISignUp = req.body;
  const newUserData = await signUp({ email, password, name });
  return res.send(newUserData).json();
};
