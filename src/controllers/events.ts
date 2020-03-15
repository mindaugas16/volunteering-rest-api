import { clearImage } from 'src/helpers/file';
import { SHOW_PER_PAGE } from '../constants/pagination.constants';
import Events from '../models/events';
import Organizations from '../models/users/organizations';
import { FormError } from './../helpers/error';
import { EventStatus } from './../models/events';

const showPerPage = SHOW_PER_PAGE;

export default {
  getEvents: async (req, res, next) => {
    const { query, location, orderBy, statuses, tags, organizations, page } = req.query;
    let condition: any;

    if (query) {
      condition = { title: { $regex: query, $options: 'i' } };
    }

    if (statuses && statuses.length) {
      condition = { ...condition, status: { $in: statuses } };
    }

    if (location) {
      condition = {
        ...condition,
        $or: [
          { 'location.address': { $regex: location, $options: 'i' } },
          { 'location.city': { $regex: location, $options: 'i' } },
          { 'location.country': { $regex: location, $options: 'i' } }
        ]
      };
    }

    if (tags && tags.length) {
      condition = {
        ...condition,
        'tags.label': { $in: tags.split(',') }
      };
    }

    if (organizations && organizations.length) {
      const foundOrganizationsIds = await Organizations.find({
        organizationName: { $in: organizations.split(',') }
      }).select('_id');

      condition = {
        ...condition,
        organization: { $in: foundOrganizationsIds.map(item => item._id) }
      };
    }

    Events.find(condition)
      .populate('organization')
      .sort({ updatedAt: -1 })
      .skip(((page || 1) - 1) * showPerPage)
      .limit(showPerPage)
      .then(async events => {
        let totalCount = 0;
        Events.find(condition).countDocuments({}, (err, count) => {
          totalCount = count;
        });
        const totalPages = Math.ceil(totalCount / showPerPage) || 1;
        const body = {
          data: events,
          meta: {
            totalPages,
            showPerPage,
            totalCount
          }
        };
        // Set data to Redis
        // client.setex(req.originalUrl, 3600, JSON.stringify(body));

        res.send(body);
      })
      .catch(err => res.status(422).json(err));
  },
  getEvent: (req, res, next) => {
    const { eventId } = req.params;

    Events.findById(eventId)
      .populate({
        path: 'activities',
        populate: {
          path: 'participation'
        }
      })
      .populate('organization')
      .then(event => {
        if (!event) {
          return res.status(404).json({ message: 'Activity not found.' });
        }
        res.json(event);
      })
      .catch(err => res.status(500).json(err));
  },
  createEvent(req, res, next) {
    const { title, status, date } = req.body;
    let currentOrganization;

    Organizations.findById(req.userId)
      .then(organization => {
        if (!organization) {
          const error = new Error('Organization not found') as any;
          error.statusCode = 404;

          return next(error);
        }
        currentOrganization = organization;

        return Events.findOne({ title });
      })
      .then(event => {
        const errors: FormError[] = [];
        if (event) {
          errors.push(new FormError('title', 'unique', 'Title should be unique'));
        }

        if (status !== EventStatus.DRAFT && !(date && date.start)) {
          errors.push(
            new FormError('startDate', 'required', 'Public event must have event date set')
          );
        }

        if (errors.length) {
          const error = new Error('Invalid input') as any;
          error.data = errors;
          error.statusCode = 400;
          throw error;
        }

        return new Events({ ...req.body, organization: currentOrganization._id }).save();
      })
      .then(event => {
        currentOrganization.events.push(event._id);
        currentOrganization.save();
        res.send(event);
      })
      .catch(err => next(err));
  },
  updatedEvent(req, res, next) {
    const { eventId } = req.params;
    const { title, description, date, location, status, customFields, imagePath } = req.body;

    Events.findById(eventId)
      .then(event => {
        if (!event) {
          const error = new Error('Event not found') as any;
          error.statusCode = 404;

          return next(error);
        }

        const errors: FormError[] = [];

        if (status !== EventStatus.DRAFT && !(date && date.start)) {
          errors.push(
            new FormError('startDate', 'required', 'Public event must have event date set')
          );
        }

        if (errors.length) {
          const error = new Error('Invalid input') as any;
          error.data = errors;
          error.statusCode = 400;
          throw error;
        }

        event.title = title;
        event.description = description;
        event.date = date;
        event.location = location;
        event.status = status;
        event.customFields = customFields;
        if (!imagePath && event.imagePath) {
          clearImage(event.imagePath);
        }
        event.imagePath = imagePath;

        return event.save();
      })
      .then(event => {
        res.send(event);
      })
      .catch(err => {
        next(err);
      });
  }
};
