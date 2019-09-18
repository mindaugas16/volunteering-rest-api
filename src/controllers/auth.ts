import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

import User from '../models/users/user';
import isEmail = require("validator/lib/isEmail");

const generateJWT = (user) => {
    return jwt.sign(
        {userId: user.id, email: user.email},
        'somesupersecretkey', {expiresIn: '1h'}
    );
};

export default {
    login: (req, res, next) => {
        const {email, password} = req.body;

        if (req.isAuth) {
            return res.sendStatus(400);
        }

        if (!isEmail(email)) {
            return res.status(400).json({error: 'Invalid input'});
        }

        User.findOne({email}).then(user => {
            if (!user) {
                return res.status(400).json({error: 'Invalid credentials'});
            }
            bcrypt.compare(password, user.password).then(doMatch => {
                if (doMatch) {
                   return res.status(200).json({
                        userId: user.id,
                        token: generateJWT(user),
                        tokenExpiration: 1
                    });
                }
                res.status(400).json({error: 'Invalid credentials'});
            });
        });
    }
};