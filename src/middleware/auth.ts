import * as jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const authHeader = req.get('Authorization');
    req.isAuth = true;

    if (!authHeader) {
        req.isAuth = false;

        return next();
    }
    const token = authHeader.split(' ')[1];

    if (!token || token === '') {
        req.isAuth = false;

        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesupersecretkey');
    } catch (err) {
        // @TODO: fix token expiration issue
        // return res.sendStatus(401).json(err);

        req.isAuth = false;
        return next();
    }

    req.userId = decodedToken.userId;
    next();
};
