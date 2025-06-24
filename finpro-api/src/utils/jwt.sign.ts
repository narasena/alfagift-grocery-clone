import jwt from "jsonwebtoken";

interface IJwtSignProps {
  userId: string;
  email: string;
  isEmailVerified: boolean;
}

interface IJwtSignPropsAdmin {
  adminId: string;
  email: string;
  role: string;
}

export const jwtSign = ({ userId, email, isEmailVerified }: IJwtSignProps) => {
  return jwt.sign({ userId, email, isEmailVerified }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1w",
  });
};

export const jwtSignAdmin = ({ adminId, email, role }: IJwtSignPropsAdmin) => {
  return jwt.sign({ adminId, email, role }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1w",
  });
};

