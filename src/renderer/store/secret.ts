/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {SecurityKeyPair}  from '@typescript-auth/server';
import {ActionTree, GetterTree, MutationTree} from "vuex";
import {RootState} from "~/store/index";

export interface LayoutState {
    rsaPath: string | undefined,
    rsaPrivateKey: string | undefined,
    rsaPublicKey: string | undefined
}

export const state = () : LayoutState => ({
    rsaPath: undefined,
    rsaPublicKey: undefined,
    rsaPrivateKey: undefined
})

export const getters : GetterTree<LayoutState, RootState> = {
    rsaPath: state => state.rsaPath,
    rsaPublicKey: state => state.rsaPublicKey,
    rsaPrivateKey: state => state.rsaPrivateKey,
}

export const actions : ActionTree<LayoutState, RootState> = {
    setRsaPath({commit}, path: string) {
        commit('setRsaPath', path);
    },
    setRSAKeyPair({commit}, keyPair: SecurityKeyPair) {
        commit('setRSAKeyPair', keyPair);
    }
}

export const mutations : MutationTree<LayoutState> = {
    setRsaPath(state, path: string) {
        state.rsaPath = path;
    },
    setRSAKeyPair(state, keyPair: SecurityKeyPair) {
        state.rsaPrivateKey = keyPair.privateKey;
        state.rsaPublicKey = keyPair.publicKey;
    }
}

// --------------------------------------------------------------------

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

