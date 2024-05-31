import dotenv from "dotenv";
dotenv.config();

const configKeys = {
    MONGODB_URI:process.env.MONGODB_URI as string,
    PORT:process.env.PORT
}

export default configKeys