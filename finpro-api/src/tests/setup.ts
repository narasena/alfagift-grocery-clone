
import { jest } from '@jest/globals';
import { PrismaClient } from '../generated/prisma/client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import { prisma } from '../prisma';

// Mock the prisma client
jest.mock('../prisma', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

export const prismaMock = prisma as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});
