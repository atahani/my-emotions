const APP_ID = 'app_id'
const USER_ID = 'user_id'

export const setUserInformation = (userId: string, appId: string): void => {
    localStorage.setItem(APP_ID, appId)
    localStorage.setItem(USER_ID, userId)
}

export const getAppId = () => localStorage.getItem(APP_ID)

export const getUserId = () => localStorage.getItem(USER_ID)

export const clearLocalStorage = () => {
    localStorage.clear()
}
