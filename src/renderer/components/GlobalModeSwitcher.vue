<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { BModal } from 'bootstrap-vue-next';
import { storeToRefs } from 'pinia';
import { computed, defineComponent, ref } from 'vue';
import { navigateTo } from '#imports';
import { useAuthStore } from '../store/auth';

export default defineComponent({
    components: {
        BModal,
    },
    setup() {
        const modalNode = ref<boolean>(false);

        const store = useAuthStore();
        const storeRefs = storeToRefs(store);

        const label = computed(() => (storeRefs.loggedIn.value ? 'Online' : 'Offline'));

        const show = () => {
            if (storeRefs.loggedIn.value) {
                navigateTo('/logout');
            } else {
                modalNode.value = true;
            }
        };

        const hide = () => {
            modalNode.value = false;
        };

        return {
            loggedIn: storeRefs.loggedIn,
            show,
            hide,
            label,
            modalNode,
        };
    },
});
</script>
<template>
    <div
        class="global-mode"
        :class="{'global-mode-online': loggedIn, 'global-mode-offline': !loggedIn}"
        @click.prevent="show"
    >
        <div class="mode">
            <h4>{{ label }}</h4>
        </div>

        <BModal
            v-model="modalNode"
            size="lg"
            button-size="sm"
            :no-close-on-backdrop="true"
            :no-close-on-esc="true"
            :hide-footer="true"
        >
            <template #title>
                <i class="fas fa-sign-in-alt" /> Login
            </template>
            <!-- todo login form -->
        </BModal>
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
