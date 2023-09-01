/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isObject } from '@personalhealthtrain/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PaillierPrivateKey, PaillierPublicKey } from '../../main/core/crypto/type';

export const useSecretStore = defineStore(
    'secret',
    () => {
        const rsaPath = ref<string | undefined>(undefined);
        const rsaPassphrase = ref<string | undefined>(undefined);
        const rsaPublicKey = ref<string | undefined>(undefined);
        const rsaPrivateKey = ref<string | undefined>(undefined);

        const hePath = ref<string | undefined>(undefined);
        const hePrivateKey = ref<PaillierPrivateKey | undefined>(undefined);
        const hePublicKey = ref<PaillierPublicKey | undefined>(undefined);

        const setRsaPath = (path: string) => {
            rsaPath.value = path;
        };

        const setRsaPassphrase = (input: string) => {
            rsaPassphrase.value = input;
        };

        const setRsaKeyPair = (keyPair: {
            privateKey: string,
            publicKey: string
        }) => {
            rsaPrivateKey.value = keyPair.privateKey;
            rsaPublicKey.value = keyPair.publicKey;
        };

        const setHePath = (path: string) => {
            hePath.value = path;
        };

        const setHePublicKey = (value: string | PaillierPublicKey) => {
            if (typeof value === 'string') {
                const data = JSON.parse(value);
                if (
                    !isObject(data) ||
                    typeof data.n !== 'string' ||
                    typeof data.g !== 'string'
                ) {
                    throw new Error('He public key is malformed');
                }

                hePublicKey.value = {
                    n: data.n,
                    g: data.g,
                };

                return;
            }

            hePublicKey.value = value;
        };

        const setHePrivateKey = (value: string | PaillierPrivateKey) => {
            if (typeof value === 'string') {
                const data = JSON.parse(value);

                if (
                    !isObject(data) ||
                    typeof data.lambda !== 'string' ||
                    typeof data.mu !== 'string'
                ) {
                    throw new Error('He private key is malformed...');
                }

                hePrivateKey.value = data as PaillierPrivateKey;
                return;
            }

            hePrivateKey.value = value;
        };

        const setHeKeyPair = (keyPair: {
            privateKey: string | PaillierPrivateKey,
            publicKey: string | PaillierPublicKey
        }) => {
            setHePrivateKey(keyPair.privateKey);
            setHePublicKey(keyPair.publicKey);
        };

        return {
            rsaPath,
            rsaPassphrase,
            rsaPublicKey,
            rsaPrivateKey,

            hePath,
            hePrivateKey,
            hePublicKey,

            setHeKeyPair,
            setHePath,
            setRsaKeyPair,
            setRsaPath,
            setRsaPassphrase,
        };
    },
);
