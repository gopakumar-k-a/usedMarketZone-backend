import express, { Application } from 'express';
const cors = require('cors')
import configKeys from '../../config';
const expressConfig = (app: Application) => {
  const corsOptions = {
    origin:configKeys.CLIENT_URL, 
    optionsSuccessStatus: 200 ,
    credentials: true,// For legacy browser support
  };
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

export default expressConfig;