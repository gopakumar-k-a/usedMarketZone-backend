import dotenv from "dotenv";
dotenv.config();

const configKeys = {
    MONGODB_URI:process.env.MONGODB_URI as string,
    PORT:process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET as string,
    MAIL_SENDER:process.env.MAIL_SENDER as string,
    MAIL_SENDER_PASS:process.env.MAIL_SENDER_PASS as string,
    CLIENT_URL:process.env.CLIENT_URL as string
}

export default configKeys