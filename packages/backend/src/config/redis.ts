export default {
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD,
    port: Number(process.env.REDIS_PORT || 6379),
}
