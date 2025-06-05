import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    console.log('Login request received:', body.email, body.password);
    return this.authService.login(body.email, body.password);
  }

  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }
}
