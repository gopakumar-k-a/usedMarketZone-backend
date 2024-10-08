import { UserDbInterface } from "../../repositories/userDbRepository";
import { AuthServiceInterface } from "../../services/authServiceInterface";
import createUserEntity, { UserEntityType } from "../../../entities/user";
import AppError from "../../../utils/appError";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import { generateOTP } from "../../../utils/generateOtp";
import createOtpEntity, { OtpEntityType } from "../../../entities/otp";
import {
  UserInterface,
  DecryptInterface,
  CreateUserInterface,
} from "../../../types/userInterface";
import { JwtForgotPasswordPayload } from "../../../types/authInterface";
import { removeSensitiveFields } from "../user/read";
import { CustomJwtPayload } from "../../../frameworks/webserver/middlewares/jwtUserTokenVerifyMiddleware";
export const VerifyAndRegister = async (
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  },
  userRepository: ReturnType<UserDbInterface>,
  userService: ReturnType<AuthServiceInterface>,
  otp: string
) => {
  const otpDoc = await userRepository.otpByEmail(user.email);

  if (otpDoc && otpDoc.otp == otp) {
    user.email = user.email.toLowerCase();

    const isExistingEmail = await userRepository.getUserByEmail(user?.email);

    if (isExistingEmail) {
      throw new AppError("user email already exists", HttpStatusCodes.CONFLICT);
    }

    const decryptedPass = (await userService.verifyToken(
      user.password
    )) as DecryptInterface;

    user.password = await userService.encryptPassword(decryptedPass?.payload);

    const { firstName, lastName, email, phone, password } = user;

    const userNameCreator = async (firstName: string, lastName: string) => {
      let userName: string = "";
      let isAvailable = false;

      while (!isAvailable) {
        userName = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${Math.floor(
          Math.random() * 10000
        )}`;
        let existingUser = await userRepository.getUserByUserName(userName);
        isAvailable = !existingUser;
      }

      return userName;
    };

    const createdUserName = await userNameCreator(firstName, lastName);

    const userEntity: UserEntityType = createUserEntity(
      firstName,
      lastName,
      email,
      phone,
      password,
      createdUserName,
      ""
    );

    const createdUser: any = await userRepository.addUser(userEntity);

    return createdUser.email;
  } else {
    throw new AppError(
      "user not registered Invalid Otp",
      HttpStatusCodes.CONFLICT
    );
  }
};

export const sendOtp = async (
  user: UserInterface,
  userRepository: ReturnType<UserDbInterface>,
  userService: ReturnType<AuthServiceInterface>,
  isResend: boolean = false
) => {
  if (!isResend) {
    const isExistingEmail = await userRepository.getUserByEmail(user?.email);
    if (isExistingEmail) {
      throw new AppError("user email already exists", HttpStatusCodes.CONFLICT);
    }

    user.password = userService.generateToken(user.password);
  }

  const otp = generateOTP();
  const otpEntity: OtpEntityType = createOtpEntity(user.email, otp);
  await userRepository.addOtp(otpEntity);
  await userService.sendOtpEmail(user.email, otp);
  return user;
};

export const resendOtp = async (
  userData: UserInterface,
  userRepository: ReturnType<UserDbInterface>,
  userService: ReturnType<AuthServiceInterface>
) => {
  const user = await userRepository.getUserByEmail(userData.email);
  if (user) {
    throw new AppError("User Exists", HttpStatusCodes.NOT_FOUND);
  }

  return await sendOtp(userData, userRepository, userService, true);
};

export const userAuthenticate = async (
  email: string,
  pass: string,
  userRepository: ReturnType<UserDbInterface>,
  userService: ReturnType<AuthServiceInterface>
) => {
  const userData: CreateUserInterface | null =
    await userRepository.getUserByEmail(email);

  if (!userData) {
    throw new AppError("this user doesn't exist", HttpStatusCodes.UNAUTHORIZED);
  }

  if (userData.isActive == false) {
    throw new AppError(
      "cannot sign in authentication blocked by admin ",
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const isPasswordCorrect = await userService.comparePassword(
    pass,
    userData.password
  );

  if (!isPasswordCorrect) {
    throw new AppError(
      "Sorry your password was incorrect",
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const user = await removeSensitiveFields(userData);
  const role = user.role;
  const jwtPayload = {
    _id: user._id,
    role,
  };

  const accessToken = await userService.generateAccessToken(
    JSON.stringify(jwtPayload)
  );
  const refreshToken = await userService.generateRefreshToken(
    JSON.stringify(jwtPayload)
  );

  return { user, role, refreshToken, accessToken };
};

export const handleRefreshAccessToken = async (
  cookies: { refreshToken: string },
  dbUserRepository: ReturnType<UserDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  if (!cookies?.refreshToken) {
    throw new AppError("Invalid token!", HttpStatusCodes.UNAUTHORIZED);
  }
  const refreshToken = cookies.refreshToken;
  const decoded = authService.verifyToken(refreshToken);
  if (!decoded) {
    throw new AppError(
      "Token expired or invalid",
      HttpStatusCodes.UNAUTHORIZED
    );
  }
  const customPayload = JSON.parse(
    (decoded as any).payload
  ) as CustomJwtPayload;

  const jwtPayload = {
    _id: customPayload._id,
    role: customPayload.role,
  };

  const newRefreshToken = authService.generateRefreshToken(
    JSON.stringify(jwtPayload)
  );

  return {
    accessToken: newRefreshToken,
  };
};
export const googleAuthenticate = async (
  userCred: {
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
    phone?: string | null;
  },
  userRepository: ReturnType<UserDbInterface>,
  userService: ReturnType<AuthServiceInterface>
) => {
  const userData = await userRepository.getUserByEmail(userCred.email);

  let user;
  let accessToken;
  let refreshToken;
  let role = "user";
  if (userData) {
    const jwtPayload = {
      _id: userData._id,
      role: "user",
    };
    const userWithoutPass = await removeSensitiveFields(userData);

    user = userWithoutPass;
    role = user.role;
    accessToken = await userService.generateAccessToken(
      JSON.stringify(jwtPayload)
    );
    refreshToken = await userService.generateRefreshToken(
      JSON.stringify(jwtPayload)
    );
  } else {
    const generatePassword = (Math.random().toString(36).slice(-5) + "A1@")
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
    const hashedPassword = await userService.encryptPassword(generatePassword);

    const createdUserName = `${userCred.firstName.toLowerCase()}_${userCred.lastName.toLowerCase()}_${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const userEntity: UserEntityType = createUserEntity(
      userCred.firstName,
      userCred.lastName,
      userCred.email,
      userCred.phone ? userCred.phone : "0",
      hashedPassword,
      createdUserName,
      userCred.imageUrl
    );

    const createdUser: any = await userRepository.addUser(userEntity);

    const userWithoutPass = await removeSensitiveFields(createdUser);

    user = userWithoutPass;
    const jwtPayload = {
      _id: createdUser._id,
      role: "user",
    };
    accessToken = await userService.generateAccessToken(
      JSON.stringify(jwtPayload)
    );
    refreshToken = await userService.generateRefreshToken(
      JSON.stringify(jwtPayload)
    );
  }
  return { user, role, accessToken, refreshToken };
};

export const forgotPasswordSendOtp = async (
  email: string,
  userRepository: ReturnType<UserDbInterface>,
  userService: ReturnType<AuthServiceInterface>
) => {
  const user = userRepository.getUserByEmail(email);

  if (!user) {
    throw new AppError(
      "No user Exist in the email please check Email or do Sign Up ",
      HttpStatusCodes.BAD_GATEWAY
    );
  }
  const otp = generateOTP();
  await userService.sendOtpEmail(email, otp);
  const otpEntity: OtpEntityType = createOtpEntity(email, otp);
  await userRepository.addOtp(otpEntity);

  const jwtPayload = {
    email,
    otp,
  };

  const otpToken = await userService.generateToken(JSON.stringify(jwtPayload));

  return otpToken;
};

export const verifyForgotPasswordOtp = async (
  otpToken: string,
  otp: string,
  userRepository: ReturnType<UserDbInterface>,
  userService: ReturnType<AuthServiceInterface>
) => {
  const decoded = userService.verifyToken(otpToken) as JwtForgotPasswordPayload;

  const decodedData = JSON.parse(decoded.payload);

  const otpDoc = await userRepository.otpByEmail(decodedData.email);

  const user = await userRepository.getUserByEmail(decodedData.email);

  if (!decodedData.otp || !user || !otpDoc) {
    throw new AppError(" invalid request ", HttpStatusCodes.UNAUTHORIZED);
  }

  if (decodedData.otp != otp || otp != otpDoc.otp) {
    throw new AppError(
      "verification failed wrong otp ",
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  return decodedData.otp == otp;
};

export const resetPassword = async (
  email: string,
  newPassword: string,
  dbRepositoryUser: ReturnType<UserDbInterface>,
  userService: ReturnType<AuthServiceInterface>
) => {
  const hashedPassword = await userService.encryptPassword(newPassword);
  dbRepositoryUser.updateUserPassword(email, hashedPassword);

  return true;
};
