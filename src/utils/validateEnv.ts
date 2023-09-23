import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  console.log('comes here');
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
  });
};

export default validateEnv;
