/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Adapter } from 'browser-storage-adapter';
import { storeToRefs } from 'pinia';
import type { Pinia } from 'pinia';
import { defineNuxtPlugin, useCookie } from '#app';
import { AuthBrowserStorageKey } from '../config/auth';
import { useAuthStore } from '../store/auth';

declare module '#app' {
    interface NuxtApp {
        $warehouse: Adapter;
    }
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $warehouse: Adapter;
    }
}

export default defineNuxtPlugin((ctx) => {
    const warehouse = new Adapter({
        driver: {
            localStorage: true,
            cookie: {
                path: '/',
            },
        },
        isServer: () => !!process.server,
        setCookie: (key, value) => {
            const cookie = useCookie<unknown>(key);
            cookie.value = value;
        },
        getCookie: (key) => {
            const cookie = useCookie(key);
            return cookie.value;
        },
    });

    ctx.provide('warehouse', warehouse);

    const store = useAuthStore(ctx.$pinia as Pinia);
    const keys: string[] = Object.values(AuthBrowserStorageKey);
    for (let i = 0; i < keys.length; i++) {
        const value = warehouse.get(keys[i]);
        if (!value) {
            continue;
        }

        switch (keys[i]) {
            case AuthBrowserStorageKey.ACCESS_TOKEN:
                if (!store.accessToken) {
                    store.setAccessToken(value);
                }
                break;
            case AuthBrowserStorageKey.ACCESS_TOKEN_EXPIRE_DATE:
                if (!store.accessTokenExpireDate) {
                    store.setAccessTokenExpireDate(value);
                }
                break;
            case AuthBrowserStorageKey.REFRESH_TOKEN:
                if (!store.refreshToken) {
                    store.setRefreshToken(value);
                }
                break;
            case AuthBrowserStorageKey.USER:
                if (!store.user) {
                    store.setUser(value);
                }
                break;
            case AuthBrowserStorageKey.REALM:
                if (!store.realm) {
                    store.setRealm(value);
                }
                break;
            case AuthBrowserStorageKey.REALM_MANAGEMENT:
                if (!store.realmManagement) {
                    store.setRealmManagement(value);
                }
                break;
        }
    }

    const storeRefs = storeToRefs(store);

    watch(storeRefs.accessToken, (val) => {
        if (val) {
            warehouse.set(AuthBrowserStorageKey.ACCESS_TOKEN, val);
        } else {
            warehouse.remove(AuthBrowserStorageKey.ACCESS_TOKEN);
            warehouse.remove(AuthBrowserStorageKey.REFRESH_TOKEN);
            warehouse.remove(AuthBrowserStorageKey.ACCESS_TOKEN_EXPIRE_DATE);
        }
    });

    watch(storeRefs.accessTokenExpireDate, (val) => {
        if (val) {
            warehouse.set(AuthBrowserStorageKey.ACCESS_TOKEN_EXPIRE_DATE, val);
        } else {
            warehouse.remove(AuthBrowserStorageKey.ACCESS_TOKEN_EXPIRE_DATE);
        }
    });

    watch(storeRefs.refreshToken, (val) => {
        if (val) {
            warehouse.set(AuthBrowserStorageKey.REFRESH_TOKEN, val);
        } else {
            // warehouse.remove(AuthBrowserStorageKey.REFRESH_TOKEN);
            // warehouse.remove(AuthBrowserStorageKey.ACCESS_TOKEN_EXPIRE_DATE);
        }
    });

    watch(storeRefs.user, (val) => {
        if (val) {
            warehouse.set(AuthBrowserStorageKey.USER, val);
        } else {
            warehouse.remove(AuthBrowserStorageKey.USER);
        }
    });

    watch(storeRefs.realm, (val) => {
        if (val) {
            warehouse.set(AuthBrowserStorageKey.REALM, val);
        } else {
            warehouse.remove(AuthBrowserStorageKey.REALM);
        }
    });

    watch(storeRefs.realmManagement, (val) => {
        if (val) {
            warehouse.set(AuthBrowserStorageKey.REALM_MANAGEMENT, val);
        } else {
            warehouse.remove(AuthBrowserStorageKey.REALM_MANAGEMENT);
        }
    });
});
