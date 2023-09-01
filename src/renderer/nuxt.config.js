/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            apiUrl: process.env.API_URL || 'https://api.personalhealthtrain.de/',
            realtimeUrl: process.env.REALTIME_URL || 'https://api.personalhealthtrain.de/',
            authupApiUrl: process.env.AUTHUP_API_URL || 'https://api.personalhealthtrain.de/auth/',
        },
    },
    ssr: false,
    target: 'static',
    loading: false,
    css: [
        '@personalhealthtrain/client-vue/dist/index.css',
        '@fortawesome/fontawesome-free/css/all.css',
        'bootstrap-vue-next/dist/bootstrap-vue-next.css',
        'bootstrap/dist/css/bootstrap.min.css',
        '@/assets/css/vue-layout-navigation.css',
        '@/assets/css/root.css',
        '@/assets/css/core/header.css',
        '@/assets/css/core/navbar.css',
        '@/assets/css/core/body.css',
        '@/assets/css/core/sidebar.css',
        '@/assets/css/core/footer.css',
        '@/assets/css/card.css',
        '@/assets/css/colors.css',
        '@/assets/css/form.css',

        '@/assets/css/bootstrap-override.css',
    ],
    modules: [
        [
            '@nuxtjs/google-fonts', {
                families: {
                    Asap: true,
                    Nunito: true,
                },
                download: true,
            },
        ],
        '@pinia/nuxt',
    ],
});
