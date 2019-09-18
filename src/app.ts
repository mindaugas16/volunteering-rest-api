import http from 'http';
import express from 'express';
import bodyParser = require("body-parser");
import mongoose from "mongoose";
import dotenv from 'dotenv';

import routes from './routes';
import cors from "./middleware/cors";
import isAuth from "./middleware/is-auth";

const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(isAuth);
app.use(cors);

app.use('/api/v1', routes);

mongoose.connect(
    // tslint:disable-next-line:max-line-length
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-eoch3.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
    {useNewUrlParser: true, useUnifiedTopology: true}
)
    .then(() => {
        const server = http.createServer(app);

        server.listen(process.env.PORT || 3000, () => {
            console.log('Server is running on port', (server.address() as any).port);
        });
    })
    .catch(error => {
        throw error;
    });