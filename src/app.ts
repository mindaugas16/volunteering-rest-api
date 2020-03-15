import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import multer from 'multer';
import * as path from 'path';
import AuthMiddleware from './middleware/auth';
import cors from './middleware/cors';
import errorHandler from './middleware/error-handler';
import routes from './routes';
import bodyParser = require('body-parser');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/assets/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({ storage: fileStorage, fileFilter }).single('image'));

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
    `mongodb://localhost:27017/volunterring`,
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
