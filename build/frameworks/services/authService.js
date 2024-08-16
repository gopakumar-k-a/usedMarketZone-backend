"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../config"));
const appError_1 = __importDefault(require("../../utils/appError"));
const httpStatusCodes_1 = require("../../types/httpStatusCodes");
const authService = () => {
    const encryptPassword = async (password) => {
        const salt = await bcryptjs_1.default.genSalt(10);
        password = await bcryptjs_1.default.hash(password, salt);
        return password;
    };
    const comparePassword = (password, hashedPassword) => {
        return bcryptjs_1.default.compare(password, hashedPassword);
    };
    const generateToken = (payload) => {
        const token = jsonwebtoken_1.default.sign({ payload }, config_1.default.JWT_SECRET, {
            expiresIn: "5d",
        });
        return token;
    };
    const generateAccessToken = (payload) => {
        const token = jsonwebtoken_1.default.sign({ payload }, config_1.default.JWT_SECRET, {
            expiresIn: "15m",
        });
        return token;
    };
    const generateRefreshToken = (payload) => {
        const token = jsonwebtoken_1.default.sign({ payload }, config_1.default.JWT_SECRET, {
            expiresIn: "7d",
        });
        return token;
    };
    const verifyToken = (token) => {
        return jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
    };
    const sendOtpEmail = async (email, otp) => {
        try {
            const transporter = nodemailer_1.default.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: config_1.default.MAIL_SENDER,
                    pass: config_1.default.MAIL_SENDER_PASS,
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
        }
        catch (error) {
            throw new appError_1.default("Error sending email", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
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
exports.authService = authService;
