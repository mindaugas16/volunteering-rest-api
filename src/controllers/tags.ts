import Events from '../models/events';

export default {
    getRelatedTags: (req, res, next) => {
        Events.find({ tags: { $exists: true, $not: { $size: 0 } } })
            .select('tags')
            .limit(20)
            .then(events => {
                const tags = events.reduce((acc: any[], event) => {
                    acc.push(...event.tags);

                    return acc;
                }, []);
                res.json(tags);
            })
            .catch(err => { throw err; });
    }
};
