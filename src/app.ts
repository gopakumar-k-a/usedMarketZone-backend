import express, { Application } from 'express';

import connectDB from './frameworks/database/mongodb/connection';

import http from 'http'

import serverConfig from './frameworks/webserver/server';

import expressConfig from './frameworks/webserver/express';

import routes from './frameworks/webserver/routes';

const app:Application=express()

const server=http.createServer(app)

connectDB()

expressConfig(app)

routes(app)

serverConfig(server).startServer()