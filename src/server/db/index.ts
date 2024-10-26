import {connectDB} from './config/connection';
import {File, Record, User} from './models';

export const db = {
    connect: connectDB,
    User,
    File,
    Record
};

export default db;