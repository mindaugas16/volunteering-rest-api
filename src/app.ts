import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import AuthMiddleware from './middleware/auth';
import cors from './middleware/cors';
import errorHandler from './middleware/error-handler';
import routes from './routes';
import bodyParser = require('body-parser');

const app = express();

dotenv.config();

app.use(bodyParser.json());

// @TODO: fix is auth middleware
app.use(AuthMiddleware.setAuth);
app.use(cors);

require('./models/activities');
require('./models/users/users');
require('./models/users/volunteers');
require('./models/events');
require('./models/participations');

app.use('/api/v1', routes);

app.use(errorHandler);

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-eoch3.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
        { useNewUrlParser: true, useUnifiedTopology: true }
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
