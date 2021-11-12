<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script>
import { mapActions } from 'vuex'

export default {
    computed: {
        navigationId (vm) {
            return vm.$store.getters['layout/navigationComponentId']
        },
        components (vm) {
            return vm.$store.state.layout.navigationComponents
        },
        loggedIn (vm) {
            return vm.$store.getters['auth/loggedIn']
        },
        user (vm) {
            return vm.$store.state.auth.user
        }
    },
    methods: {
        async click ($index) {
            const component = this.components[$index]

            await this.$store.dispatch('layout/selectComponent', {
                type: 'navigation',
                component: {
                    id: component.id
                }
            })

            if (typeof component.url !== 'undefined') {
                await this.$router.push(component.url)
            }
        }
    }
}
</script>
<template>
    <div>
        <header class="page-header fixed-top">
            <div class="header-title ml-3">
                <div class="logo">
                    <span>P</span>H<span>T</span>
                    <span class="info-text">LocalTool</span>
                </div>
            </div>
            <nav class="page-navbar navbar-expand-md">
                <b-collapse id="page-navbar" class="navbar-content navbar-collapse">
                    <ul v-if="loggedIn && user" class="navbar-nav navbar-gadgets">
                        <li class="nav-item">
                            <nuxt-link class="nav-link user-link" :to="'/users/'+user.id">
                                <v-gravatar :email="user.email ? user.email : ''" />
                                <span>{{ user.display_name ? user.display_name : user.name }}</span>
                            </nuxt-link>
                        </li>
                        <li class="nav-item">
                            <nuxt-link :to="'/settings'" class="nav-link">
                                <i class="fa fa-cog" />
                            </nuxt-link>
                        </li>
                        <li class="nav-item">
                            <nuxt-link :to="'/logout'" class="nav-link">
                                <i class="fa fa-power-off" />
                            </nuxt-link>
                        </li>
                    </ul>
                </b-collapse>
            </nav>
        </header>
    </div>
</template>
