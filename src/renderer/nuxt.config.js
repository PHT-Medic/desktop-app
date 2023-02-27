/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

const path = require('node:path');

module.exports = {
    publicRuntimeConfig() {
        return {
            apiUrl: process.env.API_URL || 'https://api.personalhealthtrain.de/',
        };
    },
    env: {
        apiUrl: process.env.API_URL || 'https://api.personalhealthtrain.de/',
    },
    ssr: false,
    target: 'static',
    head: {
        title: 'PHT: Desktop-App',
        meta: [
            { charset: 'utf-8' },
        ],
    },
    loading: false,
    plugins: [
        './plugins/ilingo',
        './plugins/api',
        './plugins/store',
        './plugins/auth',
        './plugins/layout',
        './plugins/app',

        './plugins/vuelidate',
        './plugins/vueTimeAgo',
        './plugins/vue'
    ],
    buildModules: [
        '@nuxt/postcss8',
        '@nuxt/typescript-build',
        '@nuxtjs/google-fonts'
    ],
    googleFonts: {
        families: {
            Asap: true,
            Nunito: true,
        },
        download: true,
    },
    modules: [
        'bootstrap-vue/nuxt',
    ],
    css: [
        '@fortawesome/fontawesome-free/css/all.css',
        'bootstrap/dist/css/bootstrap.min.css',
        'bootstrap-vue/dist/bootstrap-vue.css',
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
    router: {
        mode: 'hash',
        middleware: ['auth', 'layout'],
    },

    build: {
        extend(config, ctx) {
            config.target = 'electron-renderer';

            if (!config.resolve) {
                config.resolve = {};
            }

            if (!config.resolve.alias) {
                config.resolve.alias = {};
            }

            if (!config.resolve.plugins) {
                config.resolve.plugins = [];
            }

            // eslint-disable-next-line no-prototype-builtins
            if (config.resolve.alias.hasOwnProperty('~')) {
                delete config.resolve.alias['~'];
            }

            // eslint-disable-next-line no-prototype-builtins
            if (config.resolve.alias.hasOwnProperty('@')) {
                delete config.resolve.alias['@'];
            }

            config.resolve.alias.axios = path.join(__dirname, '..', '..', 'node_modules', 'axios', 'dist', 'browser', 'axios.cjs');
            config.resolve.alias.hapic = path.join(__dirname, '..', '..', 'node_modules', 'hapic', 'dist', 'index.cjs');
            config.resolve.alias['@hapic/oauth2'] = path.join(__dirname, '..', '..', 'node_modules', '@hapic', 'oauth2', 'dist', 'index.cjs');
            config.resolve.alias['@authup/common'] = path.join(__dirname, '..', '..', 'node_modules', '@authup', 'common', 'dist', 'index.cjs');
            config.resolve.alias['@authup/vue2'] = path.join(__dirname, '..', '..', 'node_modules', '@authup', 'vue2', 'dist', 'index.cjs');

            config.module.rules.push({
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto',
            });
        }
    },
};
