import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signup(body: {
    email: string;
    password: string;
    name: string;
    bankAlias: string;
  }) {
    const { email, password, name, bankAlias } = body;

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
      bankAlias,
    });

    const payload = { email: newUser.email, sub: newUser._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        bankAlias: newUser.bankAlias,
      },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    console.log('Login attempt:', { email, rawPass: password, hashed: user?.password });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...rest } = user;
      return rest;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { email: user.email, sub: user._id.toString() };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
