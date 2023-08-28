<!--
  - Copyright (c) 2021-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script>

import { Countdown } from '@vue-layout/countdown';
import { NavigationComponents } from '@vue-layout/navigation';
import { storeToRefs } from 'pinia';
import { defineNuxtComponent } from '#app';
import { computed } from '#imports';
import { useAuthStore } from '../../store/auth';
import GlobalModeSwitcher from '~/components/GlobalModeSwitcher.vue';

export default defineNuxtComponent({
    components: { Countdown, GlobalModeSwitcher, NavigationComponents },
    setup() {
        const store = useAuthStore();
        const { loggedIn, accessTokenExpireDate: tokenExpireDate, realmManagement } = storeToRefs(store);

        const tokenExpiresIn = computed(() => {
            if (!tokenExpireDate.value) {
                return 0;
            }

            return tokenExpireDate.value.getTime() - Date.now();
        });

        const docsURL = computed(() => 'https://pht-medic.github.io/documentation/');

        return {
            loggedIn,
            tokenExpiresIn,
            docsURL,
            realmManagement,
        };
    },
});
</script>
<template>
    <div class="page-sidebar">
        <div class="sidebar-header p-0">
            <global-mode-switcher />
        </div>

        <navigation-components
            class="sidebar-menu navbar-nav"
            :tier="1"
        />

        <div class="mt-auto">
            <div
                v-if="loggedIn"
                class="font-weight-light d-flex flex-column ms-3 me-3 mb-1 mt-auto"
            >
                <small class="countdown-text">
                    <Countdown
                        :time="tokenExpiresIn"
                    >
                        <template #default="props">
                            <i class="fa fa-clock pe-1" /> The session expires in
                            <span class="text-success">
                                {{ props.minutes }} minute(s), {{ props.seconds }} second(s)
                            </span>
                        </template>
                    </Countdown>
                </small>
            </div>

            <ul class="sidebar-menu nav-items navbar-nav">
                <li class="nav-item">
                    <div class="nav-separator">
                        General
                    </div>
                </li>
                <li class="nav-item">
                    <a
                        class="nav-link"
                        :href="docsURL"
                        target="_blank"
                    >
                        <i class="fa fa-file-pdf" /> <span class="nav-link-text">Documentation / Guide</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
