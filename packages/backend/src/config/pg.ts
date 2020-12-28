export default {
    database: process.env.POSTGRES_DB || 'my_emotions',
    host: process.env.POSTGRES_HOST || 'localhost',
    logging: process.env.TYPEORM_LOGGING === 'true',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    port: Number(process.env.POSTGRES_PORT || 5432),
    username: process.env.POSTGRES_USER || 'postgres',
}
