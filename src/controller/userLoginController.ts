import { Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { userExists } from '../services/user_Service';

export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).send('All input is required');
    }
    const user = await userExists({ email: email.toLowerCase() });
    if (user && (await bcrypt.compare(password, user?.password))) {
      const jwtSecret: string = process.env.JWT_SECRET!;
      const token = Jwt.sign({ user_id: user._id, email }, jwtSecret, {
        expiresIn: '2h',
      });
      const data = {
        token,
        email,
        personalInformation: user?.personalInformation,
        timeAccountCreation: Date.now(),
        createdAt: new Date().toLocaleString(),
      };
      res.status(200).json(data);
    }
    res.status(400).send('Invalid Credentials');
  } catch (err) {
    console.log(err);
  }
};
