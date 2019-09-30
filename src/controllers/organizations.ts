import Organizations from '../models/users/organizations';
import Volunteer from '../models/users/volunteers';

export default {
    getOrganizations: (req, res, next) => {
        const { query } = req.query;
        let condition: any;

        if (query) {
            condition = { organizationName: { $regex: query, $options: 'i' } };
        }
        Organizations
            .find(condition)
            .then(organizations => {
                res.json(organizations);
            }).catch(err => res.status(500).json(err));
    },
    getOrganization: (req, res, next) => {
        Organizations.findById(req.params.organizationId)
            .populate('events')
            .populate('members')
            .then(organization => {
                res.json(organization);
            }).catch(err => res.status(500).json(err));
    },
    join: (req, res, next) => {
        const { organizationId } = req.params;

        if (!organizationId) {
            const error = new Error('Organization id is not provided!') as any;
            error.statusCode = 422;

            return next(error);
        }

        Organizations.updateOne({ _id: organizationId }, { $push: { members: req.userId } })
            .then(() => Volunteer.updateOne({ _id: req.userId }, { $push: { organizations: organizationId } }))
            .then(() => res.send({ success: true }))
            .catch(err => next(err));
    },
    leave: (req, res, next) => {
        const { organizationId } = req.params;

        Organizations.updateOne({ _id: organizationId }, { $pull: { members: req.userId } })
            .then(() => Volunteer.updateOne({ _id: req.userId }, { $pull: { organizations: organizationId } }))
            .then(() => res.send({ success: true }))
            .catch(err => next(err));
    }
};
