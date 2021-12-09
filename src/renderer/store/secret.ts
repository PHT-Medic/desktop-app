/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { RootState } from './index';

export interface LayoutState {
    defaultPath: string | undefined,
    defaultPrivateKey: string | undefined,
    defaultPublicKey: string | undefined,

    hePath: string | undefined,
    hePrivateKey: string | undefined,
    hePublicKey: string | undefined
}

export const state = () : LayoutState => ({
    defaultPath: undefined,
    defaultPublicKey: undefined,
    defaultPrivateKey: undefined,

    hePath: undefined,
    hePrivateKey: undefined,
    hePublicKey: undefined,
} as LayoutState);

export const getters : GetterTree<LayoutState, RootState> = {
    defaultPath: (state) => state.defaultPath,
    defaultPublicKey: (state) => state.defaultPublicKey,
    defaultPrivateKey: (state) => state.defaultPrivateKey,

    hePath: (state) => state.hePath,
    hePublicKey: (state) => state.hePublicKey,
    hePrivateKey: (state) => state.hePrivateKey,
};

export const actions : ActionTree<LayoutState, RootState> = {
    setDefaultPath({ commit }, path: string) {
        commit('setDefaultPath', path);
    },
    setDefaultKeyPair({ commit }, keyPair: { privateKey: string, publicKey: string }) {
        commit('setDefaultKeyPair', keyPair);
    },

    setHePath({ commit }, path: string) {
        commit('setHePath', path);
    },
    setHeKeyPair({ commit }, keyPair: { privateKey: string, publicKey: string }) {
        commit('setHeKeyPair', keyPair);
    },
};

export const mutations : MutationTree<LayoutState> = {
    setDefaultPath(state, path: string) {
        state.defaultPath = path;
    },
    setDefaultKeyPair(state, keyPair: { privateKey: string, publicKey: string }) {
        state.defaultPrivateKey = keyPair.privateKey;
        state.defaultPublicKey = keyPair.publicKey;
    },

    setHePath(state, path: string) {
        state.hePath = path;
    },
    setHeKeyPair(state, keyPair: { privateKey: string, publicKey: string }) {
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
