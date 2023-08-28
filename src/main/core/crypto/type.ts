/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PublicKey } from 'paillier-bigint';

// ---------------------------------------------------

export type PaillierPrivateKey = {
    mu: string,
    lambda: string,
    publicKey?: PublicKey
};

export type PaillierPublicKey = {
    n: string,
    g: string
};
