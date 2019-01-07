import * as Yup from 'yup'
import { User } from '../common/UserQuery';

interface UserProfile {
    name: string
}

const UserProfileSchema = Yup.object().shape({
    name: Yup.string()
})

export function getUserProfile(user: User) {
    const data = JSON.parse(user.data);
    UserProfileSchema.validateSync(data);

    return data as UserProfile
}