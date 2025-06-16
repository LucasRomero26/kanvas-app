import express_server from 'express';
import cors_server from 'cors';
import 'dotenv/config';
import { connectDB as connectDB_server } from './config/db';
import mainRouter_server from './router';

connectDB_server();
const app_server = express_server();
app_server.use(cors_server());
app_server.use(express_server.json());
app_server.use('/api', mainRouter_server);

export default app_server;