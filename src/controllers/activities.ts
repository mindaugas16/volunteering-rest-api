import Activities, { ActivityInterface } from '../models/activities';
import Participation from '../models/participations';
import Volunteers, { VolunteerInterface } from '../models/users/volunteers';
import { SHOW_PER_PAGE } from '../constants/pagination.constants';

const showPerPage = SHOW_PER_PAGE;

export default {
    getActivities: (req, res, next) => {
        const { query, location, page } = req.query;

        Activities
            .find()
            .populate('event')
            .sort({ updatedAt: -1 })
            .skip(((page || 1) - 1) * showPerPage)
            .then(activities => {
                let totalCount = 0;
                Activities.find().countDocuments()
                    .then(count => {
                        totalCount = count;
                    })
                    .catch(err => {
                        throw err;
                    });
                const totalPages = Math.ceil(totalCount / showPerPage) || 1;
                const body = {
                    data: activities,
                    meta: {
                        totalPages,
                        showPerPage,
                        totalCount
                    }
                };
                res.send(body);
            })
            .catch(err => res.status(500).json(err));
    },
    getActivity: (req, res, next) => {
        const { activityId } = req.params;

        Activities.findById(activityId)
            .then(activity => {
                if (!activity) {
                    return res.status(404).json({ message: 'Activity not found.' });
                }
                res.json(activity);
            })
            .catch(err => res.status(500).json(err));
    },
    register: (req, res, next) => {
        const { activityId } = req.params;
        let tempActivity: ActivityInterface;
        let tempVolunteer: VolunteerInterface;

        Activities.findOne({ _id: activityId })
            .then(activity => {
                if (!activity) {
                    const error = new Error('Activity not found') as any;
                    error.statusCode = 404;

                    return next(error);
                }
                tempActivity = activity;

                return Volunteers.findOne({ _id: req.userId });
            })
            .then(user => {
                if (!user) {
                    const error = new Error('User not found') as any;
                    error.statusCode = 404;

                    return next(error);
                }
                tempVolunteer = user;

                return new Participation({
                    volunteer: req.userId,
                    activity: activityId
                }).save();
            })
            .then(async participation => {
                tempActivity.participation.push(participation._id);
                tempVolunteer.participation.push(participation._id);

                await tempActivity.save();
                await tempVolunteer.save();

                res.send({ success: true });
            })
            .catch(err => {
                throw err;
            });
    }
};
