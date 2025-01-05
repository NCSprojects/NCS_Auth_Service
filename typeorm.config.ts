import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './src/user/entities/user.entity';
import { configDotenv } from 'dotenv';
configDotenv();

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: parseInt(process.env.TYPEORM_PORT || '3307', 10),
  username: process.env.TYPEORM_USERNAME || 'root',
  password: process.env.TYPEORM_PASSWORD || 'ncs1269!',
  database: process.env.TYPEORM_DATABASE || 'ncs',
  entities: [User],
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
};
