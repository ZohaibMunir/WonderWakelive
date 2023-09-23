import { DB_HOST, DB_PORT, DB_DATABASE, MOGOOSE_URL } from '@config';

export const dbConnection = {
  // url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  url: `${MOGOOSE_URL}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
