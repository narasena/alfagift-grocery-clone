import jwt from "jsonwebtoken";
interface IJwtSignProps {
  userId: string;
  email: string;
  isEmailVerified: boolean;
}

export const jwtSign = ({ userId, email, isEmailVerified }: IJwtSignProps) => {
  return jwt.sign({ userId, email, isEmailVerified }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1w",
  });
};