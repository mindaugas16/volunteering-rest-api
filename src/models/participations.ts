import { Document, model, Schema } from 'mongoose';
import { ActivityInterface } from 'src/models/activities';
import { VolunteerInterface } from 'src/models/users/volunteers';

export interface ParticipationInterface extends Document {
    volunteer: VolunteerInterface;
    activity: ActivityInterface;
    additionalInformation: string;
    createdAt: string;
    updatedAt: string;
}

const participationSchema = new Schema({
    volunteer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activity: {
        type: Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    },
    additionalInformation: {
        type: String
    }
}, { timestamps: true });

export default model<ParticipationInterface>('Participation', participationSchema);
