import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/users/users';
import Volunteer from '../models/users/volunteers';
import Organization from '../models/users/organizations';
import Sponsor from '../models/users/sponsors';
import { dateToString } from '../helpers/date';
import isEmail = require('validator/lib/isEmail');

const generateJWT = user =>
  jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', {
    expiresIn: '1h'
  });

export default {
  login: (req, res, next) => {
    const { email, password } = req.body;

    if (req.isAuth || !isEmail(email)) {
      const error = new Error('Invalid input') as any;
      error.statusCode = 422;

      return next(error);
    }

    User.findOne({ email })
      .then(user => {
        if (!user) {
          const error = new Error('User not exist') as any;
          error.statusCode = 422;

          return next(error);
        }

        bcrypt.compare(password, user.password).then((doMatch: boolean) => {
          if (doMatch) {
            return res.status(200).send({
              userId: user.id,
              token: generateJWT(user),
              tokenExpiration: 1
            });
          }
          const error = new Error('Invalid credentials') as any;
          error.statusCode = 422;

          return next(error);
        });
      })
      .catch(err => next(err));
  },
  signUp: (req, res, next) => {
    const { email, userRole, termsAndConditions, password } = req.body;

    const errors: { field: string; type: string; message: string }[] = [];

    if (!isEmail(email)) {
      errors.push({
        field: 'email',
        type: 'invalidEmail',
        message: 'Invalid email'
      });
    }

    if (!termsAndConditions) {
      errors.push({
        field: 'termsAndConditions',
        type: 'required',
        message: 'Terms and conditions should be checked'
      });
    }

    if (errors.length) {
      const error = new Error('Invalid input') as any;
      error.data = errors;
      error.statusCode = 422;

      return next(error);
    }

    let type = User;
    switch (userRole) {
      case 'VOLUNTEER':
        type = Volunteer;
        break;
      case 'ORGANIZATION':
        type = Organization;
        break;
      case 'SPONSOR':
        type = Sponsor;
        break;
    }
    User.findOne({ email })
      .then(user => {
        if (user) {
          const error = new Error('User already exist') as any;
          error.statusCode = 422;

          return next(error);
        }

        return bcrypt.hash(password, 12);
      })
      .then(async hashedPassword => {
        const { password, ...rest } = req.body;

        return new type({
          ...rest,
          password: hashedPassword,
          role: userRole
        }).save();
      })
      .then(result =>
        res.json({
          ...result._doc,
          _id: result.id
        })
      )
      .catch(err => {
        next(err);
      });
  },
  resetPassword: (req, res, next) => {
    const { token, password } = req.body;
    User.findOne({
      resetToken: token,
      resetTokenExpiresAt: { $gt: Date.now() }
    })
      .then(user => {
        if (!user) {
          return res.status(400).json({ message: 'Reset token is invalid' });
        }

        bcrypt.hash(password, 12).then(async newPassword => {
          user.passwordResetAt = dateToString(new Date());
          user.password = newPassword;
          user.resetToken = undefined;
          user.resetTokenExpiresAt = undefined;

          return user.save();
        });
      })
      .then(() => res.sendStatus(201))
      .catch(err => next(err));
  }
};
