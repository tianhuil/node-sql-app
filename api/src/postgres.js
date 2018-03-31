import Sequelize from 'sequelize';

export function setup() {
  const POSTGRES_USER = process.env.POSTGRES_USER,
        POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD,
        POSTGRES_HOST = process.env.POSTGRES_HOST,
        POSTGRES_DB = process.env.POSTGRES_DB,
        POSTGRES_PORT = process.env.POSTGRES_PORT

  console.log(POSTGRES_USER)

  const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
  });

  const User = sequelize.define('user', {
    username: Sequelize.STRING,
    birthday: Sequelize.DATE
  });

  sequelize.sync()
    .then(() => User.create({
      username: 'janedoe',
      birthday: new Date(1980, 6, 20)
    }))
    .then(jane => {
      console.log(jane.toJSON());
    });
}
