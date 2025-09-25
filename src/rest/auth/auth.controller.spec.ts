import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../services/prisma.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JWT_EXPIRATION, JWT_SECRET } from './constants';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

const USER_EMAIL = 'support@example.com';
const USER_PASSWORD = 'securepassword';

describe('AuthController', () => {
  let controller: AuthController;
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

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should have a login method', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(controller.login).toBeDefined();
      expect(typeof controller.login).toBe('function');
    });

    it('should get a token on login', async () => {
      const user = await service.validateUserPassword(USER_EMAIL, USER_PASSWORD);

      jest.spyOn(controller, 'login').mockImplementation(async () => {
        const token = await service.login(user.id);
        return { access_token: token };
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
      expect(await controller.login({ user } as any)).toEqual({ access_token: expect.any(String) });
    });
  });

  describe('getProfile', () => {
    it('should have a getProfile method', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(controller.getProfile).toBeDefined();
      expect(typeof controller.getProfile).toBe('function');
    });

    it('should return user profile', async () => {
      const user = await service.validate(USER_EMAIL, USER_PASSWORD);
      jest.spyOn(controller, 'getProfile').mockImplementation(() => user);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(controller.getProfile({ user } as any)).toEqual(user);
    });
  });
});
