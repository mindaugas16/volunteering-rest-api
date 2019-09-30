import { Schema } from 'mongoose';
import User, { UserInterface } from './user';
import { OrganizationInterface } from './organization';
import { AchievementInterface } from '../achievement';
import { ParticipationInterface } from '../participations';

export interface VolunteerInterface extends UserInterface {
    organizations: OrganizationInterface[];
    achievements: AchievementInterface[];
    participation: ParticipationInterface[];
}

const volunteerSchema = new Schema({
    participation: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Participation'
        }
    ],
    skills: [
        {
            type: String
        }
    ],
    interests: [
        {
            type: String
        }
    ],
    achievements: [
        {
            type: Schema.Types.Mixed
        }
    ],
    organizations: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Organization'
        }
    ],
    favorites: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ]
});

export default User.discriminator<VolunteerInterface>('Volunteer', volunteerSchema);
