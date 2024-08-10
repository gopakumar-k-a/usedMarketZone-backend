import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import nodemailer from "nodemailer";
import crypto from "crypto";
import configKeys from "../../config";
import AppError from "../../utils/appError";
import { HttpStatusCodes } from "../../types/httpStatusCodes";

export const authService = () => {
  const encryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    return password;
  };

  const comparePassword = (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword);
  };

  const generateToken = (payload: any) => {
    const token = jwt.sign({ payload }, configKeys.JWT_SECRET, {
      expiresIn: "5d",
    });
    return token;
  };
  const generateAccessToken = (payload: any) => {
    const token = jwt.sign({ payload }, configKeys.JWT_SECRET, {
      expiresIn: "15m",
    });
    return token;
  };
  const generateRefreshToken = (payload: any) => {
    const token = jwt.sign({ payload }, configKeys.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  };

  const verifyToken = (token: string) => {
    return jwt.verify(token, configKeys.JWT_SECRET);
  };

  const sendOtpEmail = async (email: string, otp: number) => {
    try {
      console.log("sended otp ", otp);

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: configKeys.MAIL_SENDER,
          pass: configKeys.MAIL_SENDER_PASS,
        },
      });

      const mailOptions = {
        from: "Used Market Zone",
        to: email,
        subject: "OTP For your verification",
        html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Used Market Zone OTP Verification</title>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      margin: 0;
                      padding: 0;
                      background-color: #f5f5f5;
                    }
                
                    .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 30px;
                      background-color: #fff;
                      border-radius: 5px;
                      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                
                    h1 {
                      font-size: 24px;
                      color: #333;
                      margin-bottom: 20px;
                    }
                
                    p {
                      font-size: 16px;
                      color: #666;
                      line-height: 1.5;
                    }
                
                    strong {
                      font-weight: bold;
                      color: #333;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>Enter this OTP to register on Used Market Zone</h1>
                    <p>Your OTP is: <strong>${otp}</strong></p>
                    <p>This OTP is valid for 1 minute. Please do not share it with anyone.</p>
                  </div>
                </body>
                </html>
                `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    } catch (error: any) {
      console.error("Error sending email:", error.message);
      throw new AppError("Error sending email", HttpStatusCodes.BAD_GATEWAY);
    }
  };

  return {
    encryptPassword,
    comparePassword,
    generateToken,
    verifyToken,
    sendOtpEmail,
    generateAccessToken,
    generateRefreshToken,
  };
};

export type AuthService = typeof authService;

export type AuthServiceReturnType = ReturnType<AuthService>;
