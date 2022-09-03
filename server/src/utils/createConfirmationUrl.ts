import { v4 } from 'uuid';
import { CONFIRM_PREFIX } from '../constants';
import { redis } from '../redis';

const createConfirmationUrl = async (userId: number) => {
    const token = v4();

    await redis.set(
        CONFIRM_PREFIX + token,
        userId,
        'EX',
        1000 * 60 * 60 * 24 * 3 // 3 days
    );

    return `http://localhost:3000/confirm/${token}`;
};

export default createConfirmationUrl;
