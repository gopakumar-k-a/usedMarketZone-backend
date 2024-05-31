import express, { Application } from 'express';

const expressConfig = (app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  };
  
  export default expressConfig;