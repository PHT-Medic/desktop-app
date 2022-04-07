import { createSign, constants } from 'crypto';

export function signHash(hash: string, privateKey: string): string {
    const sign = createSign('SHA512');

    let buffer = Buffer.from(hash, 'hex');
    sign.update(buffer);

    const signature = sign.sign({
        key: privateKey
    });

    return signature.toString('hex');
}
