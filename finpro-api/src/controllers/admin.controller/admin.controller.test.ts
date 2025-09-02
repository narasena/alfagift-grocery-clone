import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../../prisma/prisma'; // Adjust path as necessary
import { getAllAdmins } from './admin.controller';
import { AppError } from '../../utils/app.error';

// Mock prisma client
jest.mock('../../../../prisma/prisma', () => ({
  prisma: {
    admin: {
      findMany: jest.fn(),
    },
  },
}));

const mockRequest = (body = {}, params = {}, query = {}, user = {}) =>
  ({
    body,
    params,
    query,
    user,
  } as Request);

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

const mockNext: NextFunction = jest.fn();

describe('Admin Controller', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext;
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('getAllAdmins', () => {
    it('should return a list of admins when successful', async () => {
      const mockAdmins = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', deletedAt: null },
        { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', deletedAt: null },
      ];

      (prisma.admin.findMany as jest.Mock).mockResolvedValue(mockAdmins);

      await getAllAdmins(req, res, next);

      expect(prisma.admin.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Successfully fetched all admins',
        data: mockAdmins,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should throw an AppError if no admins are found', async () => {
      (prisma.admin.findMany as jest.Mock).mockResolvedValue([]);

      await getAllAdmins(req, res, next);

      expect(prisma.admin.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
        },
      });
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect((next as jest.Mock).mock.calls[0][0].message).toBe('No admin found.');
      expect((next as jest.Mock).mock.calls[0][0].statusCode).toBe(404);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with an error if prisma throws an error', async () => {
      const prismaError = new Error('Database error');
      (prisma.admin.findMany as jest.Mock).mockRejectedValue(prismaError);

      await getAllAdmins(req, res, next);

      expect(prisma.admin.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
        },
      });
      expect(next).toHaveBeenCalledWith(prismaError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
