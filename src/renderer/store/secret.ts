/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { ActionTree, GetterTree, MutationTree } from 'vuex';
import { hasOwnProperty } from '@personalhealthtrain/central-common';
import type { RootState } from './index';
import type { PaillierPrivateKey, PaillierPublicKey } from '../domains/encryption/type';

export interface LayoutState {
    defaultPath: string | undefined,
    defaultPrivateKey: string | undefined,
    defaultPublicKey: string | undefined,
    defaultPassphrase: string | undefined,

    hePath: string | undefined,
    hePrivateKey: PaillierPrivateKey | undefined,
    hePublicKey: PaillierPublicKey | undefined
}

export const state = () : LayoutState => ({
    defaultPath: undefined,
    defaultPassphrase: undefined,
    defaultPublicKey: undefined,
    defaultPrivateKey: undefined,

    hePath: undefined,
    hePrivateKey: undefined,
    hePublicKey: undefined,
} as LayoutState);

export const getters : GetterTree<LayoutState, RootState> = {
    defaultPath: (state) => state.defaultPath,
    defaultPassphrase: (state) => state.defaultPassphrase,
    defaultPublicKey: (state) => state.defaultPublicKey,
    defaultPrivateKey: (state) => state.defaultPrivateKey,

    hePath: (state) => state.hePath,
    hePublicKey: (state) : PaillierPublicKey | undefined => state.hePublicKey,
    hePrivateKey: (state) : PaillierPrivateKey | undefined => state.hePrivateKey,
};

export const actions : ActionTree<LayoutState, RootState> = {
    setDefaultPath({ commit }, path: string) {
        commit('setDefaultPath', path);
    },
    setDefaultKeyPair({ commit }, keyPair: {
        privateKey: string,
        publicKey: string
    }) {
        commit('setDefaultKeyPair', keyPair);
    },

    setHePath({ commit }, path: string) {
        commit('setHePath', path);
    },
    setHeKeyPair({ commit }, keyPair: {
        privateKey: string,
        publicKey: string
    }) {
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

        const privateKey : PaillierPrivateKey = {
            lambda: privateKeyData.lambda,
            mu: privateKeyData.mu,
        };

        commit('setHeKeyPair', {
            privateKey,
            publicKey,
        });
    },
};

export const mutations : MutationTree<LayoutState> = {
    setDefaultPath(state, path: string) {
        state.defaultPath = path;
    },
    setDefaultPassphrase(state, passphrase: string) {
        state.defaultPassphrase = passphrase;
    },
    setDefaultKeyPair(state, keyPair: { privateKey: string, publicKey: string }) {
        state.defaultPrivateKey = keyPair.privateKey;
        state.defaultPublicKey = keyPair.publicKey;
    },

    setHePath(state, path: string) {
        state.hePath = path;
    },
    setHeKeyPair(state, keyPair: {
        privateKey: PaillierPrivateKey,
        publicKey: PaillierPublicKey
    }) {
        state.hePrivateKey = keyPair.privateKey;
        state.hePublicKey = keyPair.publicKey;
    },
};

// --------------------------------------------------------------------

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
