import { UserProfileView } from '@my-emotions/types'

const USER_PROFILE = 'user_profile'
const IS_LOGGED_IN = 'is_logged_in'

export const setUserProfile = (userProfile: UserProfileView) => {
    localStorage.setItem(USER_PROFILE, JSON.stringify(userProfile))
    localStorage.setItem(IS_LOGGED_IN, 'true')
}

export const getUserProfile = (): UserProfileView => {
    const data = localStorage.getItem(USER_PROFILE)
    return data ? JSON.parse(data) : null
}

export const isLoggedIn = (): boolean => localStorage.getItem(IS_LOGGED_IN) === 'true'

export const clearLocalStorage = () => {
    localStorage.clear()
}
