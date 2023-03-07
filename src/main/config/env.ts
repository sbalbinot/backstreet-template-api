export const env = {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/backstreet-template-db',
  port: process.env.PORT ?? 5050,
  jwtSecret: process.env.JWT_SECRET ?? 'r3turn_t0-m0nke',
  salt: process.env.SALT ?? 12
}
