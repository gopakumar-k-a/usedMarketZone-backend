import { UserDbInterface } from "../../repositories/userDbRepository";
import { AuthServiceInterface } from "../../services/authServiceInterface";
import createUserEntity, { UserEntityType } from "../../../entities/user";
import createGoogleEntity, {
  GoogleUserEntityType,
} from "../../../entities/googleUserEntity";
import AppError from "../../../utils/appError";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import { generateOTP } from "../../../utils/generateOtp";
import createOtpEntity, { OtpEntityType } from "../../../entities/otp";
import {
  UserInterface,
  DecryptInterface,
  CreateUserInterface,
} from "../../../types/userInterface";
import { removeSensitiveFields } from "../user/read";


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

  // console.log('otp in db ', otpDoc);

  if (otpDoc && otpDoc.otp == otp) {
    // console.log('verfied otp true')
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

    console.log("created UserName ", createdUserName);

    const userEntity: UserEntityType = createUserEntity(
      firstName,
      lastName,
      email,
      phone,
      password,
      createdUserName,
      "" //image url
    );
    console.log(userEntity.getLastName());

    const createdUser: any = await userRepository.addUser(userEntity);

    console.log(createdUser);

    return createdUser.email;
  } else {
    console.log("not verifed ");
    throw new AppError(
      "user not registered Invalid Otp",
      HttpStatusCodes.CONFLICT
    );
  }
};

export const sendOtp = async (
  user: UserInterface,
  userRepository: ReturnType<UserDbInterface>,
  userService: ReturnType<AuthServiceInterface>
) => {
  const isExistingEmail = await userRepository.getUserByEmail(user?.email);

  if (isExistingEmail) {
    throw new AppError("user email already exists", HttpStatusCodes.CONFLICT);
  }

  user.password = userService.generateToken(user.password);
  // user.confirmPassword = null
  console.log(user);

  const otp = generateOTP();
  const otpEntity: OtpEntityType = createOtpEntity(user.email, otp);
  await userRepository.addOtp(otpEntity);
  await userService.sendOtpEmail(user.email, otp);
  return user;
};

export const userAuthenticate = async (
  email: string,
  pass: string,
  userRepository: ReturnType<UserDbInterface>,
  userService: ReturnType<AuthServiceInterface>
) => {
  const userData: CreateUserInterface | null =
    await userRepository.getUserByEmail(email);

  console.log("user is ", userData);

  if (!userData) {
    throw new AppError("this user doesn't exist", HttpStatusCodes.UNAUTHORIZED);
  }

  if(userData.isActive==false){
    console.log('inside this');
    
    throw new AppError("cannot sign in authentication blocked by admin ",HttpStatusCodes.UNAUTHORIZED)
  }

  //   const applicantId = user?._id;

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

  const jwtPayload = {
    _id: userData._id,
    role: "user",
  };

  // const user = omit(userData, "password");
  const user = await removeSensitiveFields(userData);

  console.log("user data is ", user);

  const token = await userService.generateToken(JSON.stringify(jwtPayload));
  const role = user.role;

  return { token, user, role };
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
  let token;
  const role = "user";
  if (userData) {
    const jwtPayload = {
      _id: userData._id,
      role: "user",
    };
    token = await userService.generateToken(JSON.stringify(jwtPayload));
    const userWithoutPass = await removeSensitiveFields(userData);

    user = userWithoutPass;
  } else {
    console.log("else user data ");

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

    // const plainUser = createdUser.toObject(); // Converts to plain JavaScript object
    // const { password, ...userWithoutPass } = plainUser;

    const userWithoutPass = await removeSensitiveFields(createdUser);

    user = userWithoutPass;
    const jwtPayload = {
      _id: createdUser._id,
      role: "user",
    };
    token = await userService.generateToken(JSON.stringify(jwtPayload));

    console.log(createdUser._id);
  }

  return { token, user, role };
};
