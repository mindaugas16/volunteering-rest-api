import User from '../models/users/users';
import isNumeric = require('validator/lib/isNumeric');

const getUser = (id: number) => User.findById(id).select('-password');

export default {
    getParticipation: (req, res, next) => {
        User
            .findById(req.params.id)
            .select('participation')
            .populate({
                path: 'participation',
                populate: {
                    path: 'activity'
                }
            })
            .then(participation => {
                res.send(participation);
            })
            .catch(err => next(err));
    },
    getUserOrganizations: (req, res, next) => {
        const { id } = req.params;
        User
            .findById(id)
            .select('organizations')
            .populate('organizations')
            .then(organizations => {
                res.send(organizations);
            })
            .catch(err => next(err));

    },
    getCurrentUser: (req, res, next) => {
        getUser(req.userId)
            .then(user => {
                if (!user) {
                    const error = new Error('User not found!') as any;
                    error.statusCode = 404;

                    return next(error);
                }

                return res.status(200).json(user);
            }).catch(err => next(err));
    },
    updateInfo: (req, res, next) => {
        const { firstName, lastName, postalCode } = req.body;

        if (!req.isAuth) {
            const error = new Error('Unauthenticated') as any;
            error.code = 401;

            return next(error);
        }

        const errors: { field: string; type: string; message: string }[] = [];

        if (!firstName) {
            errors.push({
                field: 'firstName',
                type: 'required',
                message: 'First name is required'
            });
        }

        if (!lastName) {
            errors.push({
                field: 'lastName',
                type: 'required',
                message: 'Last name is required'
            });
        }

        if (!isNumeric(postalCode)) {
            errors.push({
                field: 'postalCode',
                type: 'numeric',
                message: 'Postal code should be numeric only'
            });
        }

        if (errors.length) {
            const error = new Error('Invalid input') as any;
            error.data = errors;
            error.code = 400;
            throw error;
        }

        getUser(req.userId)
            .then(user => {
                if (!user) {
                    const error = new Error('User not found') as any;
                    error.code = 404;

                    return next(error);
                }
                user.firstName = firstName;
                user.lastName = lastName;
                user.postalCode = postalCode;

                return user.save();
            })
            .then(user => {
                res.send(user);
            })
            .catch(err => next(err));
    }
};
