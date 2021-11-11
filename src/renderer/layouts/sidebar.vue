<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script>
import {URL} from 'url';
import SidebarComponents from '../components/layout/SidebarComponents';

export default {
    components: { SidebarComponents },
    computed: {
        loggedIn (vm) {
            return vm.$store.getters['auth/loggedIn']
        },
        navigationId (vm) {
            return vm.$store.getters['layout/navigationComponentId']
        },
        components (vm) {
            return vm.$store.state.layout.sidebarComponents
        },
        generalDocsUrl () {
            return 'https://pht-medic.github.io/documentation/'
        }
    }
}
</script>
<template>
    <div class="page-sidebar">
        <sidebar-components
            :key="navigationId"
            class="sidebar-menu"
            :items="components"
        />

        <div class="mt-auto">
            <ul class="sidebar-menu">
                <li>
                    <div class="nav-separator">
                        General
                    </div>
                </li>
                <li>
                    <a class="sidebar-menu-link" :href="generalDocsUrl" target="_blank">
                        <i class="fa fa-file-pdf" /> Documentation / Guide
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
