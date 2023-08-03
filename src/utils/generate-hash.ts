import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import crypto from 'crypto';

export const generateHash = (): string => crypto.createHash('sha256').update(randomStringGenerator()).digest('hex');
