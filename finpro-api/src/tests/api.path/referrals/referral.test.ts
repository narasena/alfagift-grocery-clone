import describeEndPoint from "../../../utils/tests/describeEndPoint";
import App from "../../../app";
import { Express } from "express";
import request from "supertest";
import { Gender } from "../../../generated/prisma";
import { prismaMock } from "../../setup";

const API_PATHS = {
  FIND_REFERRAL: "/api/referrals/find/:referralCode",
};

describe("ReferralController - Unit Test", () => {
  let app: Express;

  beforeAll(() => {
    const application = new App();
    app = application.getApp();
  });

  describe(describeEndPoint("GET", API_PATHS.FIND_REFERRAL), () => {
    const mockedUserFound = {
      id: "usermock1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password",
      phoneNumber: "1234567890",
      gender: Gender.Male,
      dateOfBirth: "1990-01-01",
      isEmailVerified: false,
      passwordResetCount: 0,
      emailChangeCount: 0,
      avatarImgUrl: null,
      cldPublicId: null,
      referralCode: "referralcode",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    it("should find a referral", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockedUserFound);
      const response = await request(app).get(API_PATHS.FIND_REFERRAL.replace(":referralCode","referralcode"));
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should handle no data found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      const response = await request(app).get(API_PATHS.FIND_REFERRAL.replace(":referralCode","wrongReferralCode"));
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch("User with this referral code not found");
    });

    it("should handle errors and call the next function", async () => {
      const mockError = new Error("Database connection failed");
      prismaMock.user.findUnique.mockRejectedValue(mockError);
      const response = await request(app).get(API_PATHS.FIND_REFERRAL.replace(":referralCode","referralcode"));
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/server error/i);
    });
  });
});
