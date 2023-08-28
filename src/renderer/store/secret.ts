/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasOwnProperty } from '@personalhealthtrain/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PaillierPrivateKey, PaillierPublicKey } from '../../main/core/crypto/type';

export const useSecretStore = defineStore(
    'secret',
    () => {
        const defaultPath = ref<string | undefined>(undefined);
        const defaultPassphrase = ref<string | undefined>(undefined);
        const defaultPublicKey = ref<string | undefined>(undefined);
        const defaultPrivateKey = ref<string | undefined>(undefined);
        const hePath = ref<string | undefined>(undefined);
        const hePrivateKey = ref<PaillierPrivateKey | undefined>(undefined);
        const hePublicKey = ref<PaillierPublicKey | undefined>(undefined);

        const setDefaultPath = (path: string) => {
            defaultPath.value = path;
        };

        const setDefaultPassphrase = (input: string) => defaultPassphrase.value = input;

        const setDefaultKeyPair = (keyPair: {
            privateKey: string,
            publicKey: string
        }) => {
            defaultPrivateKey.value = keyPair.privateKey;
            defaultPublicKey.value = keyPair.publicKey;
        };

        const setHePath = (path: string) => {
            hePath.value = path;
        };

        const setHeKeyPair = (keyPair: { privateKey: string, publicKey: string }) => {
            const publicKeyData = JSON.parse(keyPair.publicKey);
            if (
                !hasOwnProperty(publicKeyData, 'n') ||
                !hasOwnProperty(publicKeyData, 'g')
            ) {
                throw new Error('Public key invalid.');
            }

            const publicKey : PaillierPublicKey = {
                n: publicKeyData.n,
                g: publicKeyData.g,
            };

            const privateKeyData = JSON.parse(keyPair.privateKey);

            if (
                !hasOwnProperty(privateKeyData, 'lambda') ||
                !hasOwnProperty(privateKeyData, 'mu')
            ) {
                throw new Error('Public key invalid.');
            }

            hePrivateKey.value = {
                lambda: privateKeyData.lambda,
                mu: privateKeyData.mu,
            };
            hePublicKey.value = publicKey;
        };

        return {
            defaultPath,
            defaultPassphrase,
            defaultPublicKey,
            defaultPrivateKey,
            hePath,
            hePrivateKey,
            hePublicKey,

            setHeKeyPair,
            setHePath,
            setDefaultKeyPair,
            setDefaultPath,
            setDefaultPassphrase,
        };
    },
);
