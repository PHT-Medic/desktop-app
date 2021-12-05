/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

module.exports = {
    publicRuntimeConfig() {
        return {
            apiUrl: process.env.API_URL || 'https://pht.personalhealthtrain.de/api/',
        };
    },
    env: {
        apiUrl: process.env.API_URL || 'https://personalhealthtrain.de/api/',
    },
    ssr: false,
    target: 'static',
    head: {
        title: 'PHT - LocalTool',
        meta: [
            { charset: 'utf-8' },
        ],
    },
    loading: false,
    plugins: [
        '@/plugins/api',
        '@/plugins/store',
        '@/plugins/auth',
        '@/plugins/layout',
        '@/plugins/app',

        '@/plugins/vuelidate',
        '@/plugins/vueFormWizard',
        '@/plugins/vueTimeAgo',
        '@/plugins/vue',
    ],
    buildModules: [
        '@nuxt/typescript-build',
        '@nuxtjs/google-fonts',
    ],
    googleFonts: {
        families: {
            Asap: true,
            Nunito: true,
        },
    },
    modules: [
        'bootstrap-vue/nuxt',
    ],
    css: [
        '@fortawesome/fontawesome-free/css/all.css',
        'vue-form-wizard/dist/vue-form-wizard.min.css',
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
        middleware: ['layout'],
    },

    build: {
        extend(config, ctx) {
            config.target = 'electron-renderer';
        },
    },
};
