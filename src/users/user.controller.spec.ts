/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    findMany: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should return a list of users with metadata', async () => {
      const mockUsers = [
        { id: '1', email: 'example@domain.com', name: 'Example User' },
        { id: '2', email: 'example@domain.com', name: 'Example User' },
      ];
      const mockTotal = mockUsers.length;
      mockUserService.findMany.mockResolvedValue(mockUsers);
      mockUserService.count.mockResolvedValue(mockTotal);

      const result = await userController.list('0', '10');

      expect(userService.findMany).toHaveBeenCalledWith({}, { take: 10, skip: 0 });
      expect(userService.count).toHaveBeenCalled();
      expect(result).toEqual({
        metadata: {
          offset: 0,
          limit: 10,
          count: mockUsers.length,
          total: mockTotal,
        },
        items: mockUsers,
        message: 'Users retrieved successfully',
        status: 200,
      });
    });

    it('should handle empty user list', async () => {
      mockUserService.findMany.mockResolvedValue([]);
      mockUserService.count.mockResolvedValue(0);
      const result = await userController.list();

      expect(userService.findMany).toHaveBeenCalledWith({}, { take: undefined, skip: undefined });
      expect(userService.count).toHaveBeenCalled();
      expect(result).toEqual({
        metadata: {
          offset: undefined,
          limit: undefined,
          count: 0,
          total: 0,
        },
        items: [],
        message: 'Users retrieved successfully',
        status: 200,
      });
    });
  });
});
