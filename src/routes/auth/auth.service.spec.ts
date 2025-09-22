import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../services/prisma.service';
import { UserModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JWT_EXPIRATION, JWT_SECRET } from './constants';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

const USER_EMAIL = 'support@example.com';
const USER_PASSWORD = 'securepassword';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
          global: true,
          secret: JWT_SECRET,
          signOptions: { expiresIn: JWT_EXPIRATION },
        }),
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy, PrismaService],
      controllers: [AuthController],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user with correct credentials', async () => {
      const user = await service.validateUser(USER_EMAIL, USER_PASSWORD);
      expect(user).toBeDefined();
      expect(user.email).toBe(USER_EMAIL);
    });

    it('should throw UnauthorizedException with incorrect credentials', async () => {
      await expect(service.validateUser(USER_EMAIL, 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException with non-existing user', async () => {
      await expect(service.validateUser('nonexistent@example.com', 'password')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('login', () => {
    it('should return a JWT token on login', async () => {
      const user = await service.validateUser(USER_EMAIL, USER_PASSWORD);
      const token = await service.login(user.id);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });
});
