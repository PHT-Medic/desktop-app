/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export enum KeyPairVariant {
    DEFAULT = 'default',
    HOMOMORPHIC_ENCRYPTION = 'homomorphic-encryption',
}
export type KeyPairVariantType = `${KeyPairVariant}`;

// ---------------------------------------------------

export enum KeyVariant {
    PRIVATE = 'private',
    PUBLIC = 'public',
}

export type KeyVariantType = `${KeyVariant}`;
