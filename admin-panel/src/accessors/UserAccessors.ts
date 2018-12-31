import * as Yup from 'yup'

interface UserProfile {
    name: string
}

const UserProfileSchema = Yup.object().shape({
    name: Yup.string()
})

export function getUserProfile(user) {
    if (user.__typename !== 'User') {
        throw new Error("Assert fail")
    }

    const data = JSON.parse(user.data);
    UserProfileSchema.validateSync(data);

    return data as UserProfile
}