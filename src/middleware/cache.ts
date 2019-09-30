import redis from 'redis';

const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

export const client = redis.createClient(REDIS_PORT);

client.on('connect', () => {
    console.log(`Connected to redis on port ${REDIS_PORT}`);
});

export default (req, res, next) => {
    const key = req.originalUrl;
    client.get(key, (err, data) => {
        if (err) {
            throw err;
        }

        if (!data) {
            return next();
        }

        res.send(data);
    });
};
