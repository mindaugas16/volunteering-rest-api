import { Document, model, Schema } from 'mongoose';
import { ActivityInterface } from './activities';
import { CustomFieldInterface } from './custom-fields';
import { OrganizationInterface } from './users/organizations';

export interface EventInterface extends Document {
  title: string;
  description: string;
  date: any;
  location: any;
  organization: OrganizationInterface;
  activities: ActivityInterface[];
  tags: any[];
  imagePath: string;
  status: any;
  customFields: CustomFieldInterface[];
}

export enum EventStatus {
  DRAFT,
  PUBLIC,
  PRIVATE
}

const eventSchema = new Schema(
  {
    status: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String
    },
    date: {
      type: Schema.Types.Mixed
    },
    location: {
      type: Schema.Types.Mixed
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    },
    activities: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Activity'
      }
    ],
    tags: [
      {
        type: Schema.Types.Mixed
      }
    ],
    customFields: [
      {
        type: Schema.Types.Mixed
      }
    ],
    imagePath: {
      type: String
    }
  },
  { timestamps: true }
);

export default model<EventInterface>('Event', eventSchema);
