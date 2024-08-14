import mongoose from 'mongoose';

import configKeys from '../../../config';

mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    await mongoose.connect(configKeys.MONGODB_URI);
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;