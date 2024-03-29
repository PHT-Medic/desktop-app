import { createSign } from 'crypto';

export function sign(hash: string, privateKey: string): string {
    const sign = createSign('SHA512');

    const buffer = Buffer.from(hash, 'hex');
    sign.update(buffer);

    const signature = sign.sign({
        key: privateKey,
    });

    return signature.toString('hex');
}
