<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script>
import LoginForm from './LoginForm';
import { LayoutKey } from '../config/layout/contants';

export default {
    components: { LoginForm },
    data() {
        return {
            busy: false,
            modeState: null,
        };
    },
    computed: {
        mode() {
            return this.$store.getters['global/mode'];
        },
        loggedIn() {
            return this.$store.getters['auth/loggedIn'];
        },
        label() {
            return this.loggedIn ?
                'Online' :
                'Offline';
        },
    },
    created() {
        this.modeState = this.mode;
    },
    methods: {
        async attemptToggle() {
            if (this.busy) return;

            if (this.loggedIn) {
                if (this.$route.meta[LayoutKey.REQUIRED_LOGGED_IN]) {
                    await this.$router.push('/logout');
                } else {
                    await this.$store.dispatch('auth/triggerLogout');
                }
            } else {
                this.$refs.form.show();
            }
        },
        async cancel() {
            this.$refs.form.hide();
        },
    },
};
</script>
<template>
    <div
        class="global-mode"
        :class="{'global-mode-online': loggedIn, 'global-mode-offline': !loggedIn}"
        @click.prevent="attemptToggle"
    >
        <div class="mode">
            <h4>{{ label }}</h4>
        </div>

        <b-modal
            ref="form"
            :hide-header="true"
            size="lg"
            button-size="sm"
            title-html="<i class='fas fa-sign-in-alt'></i> Login"
            :no-close-on-backdrop="true"
            :no-close-on-esc="true"
            :hide-footer="true"
        >
            <login-form
                class="p-3"
                @logged-in="cancel"
                @cancel="cancel"
            />
        </b-modal>
    </div>
</template>
<style>
.global-mode {
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.global-mode-online {
    /* background: rgb(73 140 90); */
    background: rgba(69, 165, 93, 0.5);
}
.global-mode-online:hover {
    background: rgba(69, 165, 93, 1);
}

.global-mode-offline {
    background: rgba(237, 66, 69, 0.5);
}

.global-mode-offline:hover {
    background: rgba(237, 66, 69, 1);
}

</style>
