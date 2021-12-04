<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script>

export default {
    components: { },
    computed: {
        loggedIn(vm) {
            return vm.$store.getters['auth/loggedIn'];
        },
        generalDocsUrl() {
            return 'https://pht-medic.github.io/documentation/';
        },
    },
};
</script>
<template>
    <div class="page-sidebar">
        <navigation-components
            class="sidebar-menu navbar-nav"
            :tier="1"
        />

        <div class="mt-auto">
            <ul class="sidebar-menu nav-items navbar-nav">
                <li class="nav-item">
                    <div class="nav-separator">
                        General
                    </div>
                </li>
                <li class="nav-item">
                    <a
                        class="nav-link"
                        :href="generalDocsUrl"
                        target="_blank"
                    >
                        <i class="fa fa-file-pdf" /> <span class="nav-link-text">Documentation / Guide</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
