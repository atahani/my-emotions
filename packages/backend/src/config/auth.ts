export default {
    googleClientId: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    googleSecret: process.env.PASSPORT_GOOGLE_SECRET,
    googleCallbackURL: process.env.PASSPORT_GOOGLE_CALLBACK_URL || 'http://localhost:5050/auth/google/redirect',
    tokenExpiresInMin: Number(process.env.TOKEN_EXPIRE_IN_MIN || 90),
}
