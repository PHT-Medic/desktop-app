<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script>
export default {
    computed: {
        loggedIn(vm) {
            return vm.$store.getters['auth/loggedIn'];
        },
        user(vm) {
            return vm.$store.state.auth.user;
        },
    },
};
</script>
<template>
    <div>
        <header class="page-header fixed-top">
            <div class="header-title">
                <div class="toggle-box">
                    <button
                        v-b-toggle="'page-navbar'"
                        type="button"
                        class="toggle-trigger"
                    >
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar" />
                        <span class="icon-bar" />
                        <span class="icon-bar" />
                    </button>
                </div>
                <div class="logo">
                    <span>A</span>P<span>P</span>
                    <span class="info-text">Personal Health Train</span>
                </div>
            </div>
            <nav class="page-navbar navbar-expand-md">
                <b-collapse
                    id="page-navbar"
                    class="navbar-content navbar-collapse"
                >
                    <ul
                        v-if="loggedIn && user"
                        class="navbar-nav nav-items navbar-gadgets"
                    >
                        <li class="nav-item">
                            <a
                                class="nav-link user-link"
                                href="javascript:void(0)"
                            >
                                <v-gravatar :email="user.email ? user.email : ''" />
                                <span>{{ user.display_name ? user.display_name : user.name }}</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <nuxt-link
                                :to="'/settings'"
                                class="nav-link"
                            >
                                <i class="fa fa-cog" />
                            </nuxt-link>
                        </li>
                        <li class="nav-item">
                            <nuxt-link
                                :to="'/logout'"
                                class="nav-link"
                            >
                                <i class="fa fa-power-off" />
                            </nuxt-link>
                        </li>
                    </ul>
                </b-collapse>
            </nav>
        </header>
    </div>
</template>
