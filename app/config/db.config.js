module.exports = {
  HOST: "db4free.net",
  USER: "abuadmin1",
  PASSWORD: "12345678",
  DB: "abutest",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
