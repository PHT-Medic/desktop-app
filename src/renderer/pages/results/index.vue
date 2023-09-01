<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { useToast } from 'bootstrap-vue-next';
import TrainResultWizard from '../../components/domains/TrainResultWizard.vue';
import { LayoutKey, LayoutNavigationID } from '~/config/layout';
import { defineNuxtComponent, definePageMeta } from '#imports';

export default defineNuxtComponent({
    components: { TrainResultWizard },
    async setup() {
        definePageMeta({
            [LayoutKey.NAVIGATION_ID]: LayoutNavigationID.DEFAULT,
        });

        const toast = useToast();

        const handleFailed = (e: Error) => {
            if (toast) {
                toast.warning({ body: e.message }, { pos: 'top-center' });
            }
        };

        const handleFinished = () => {
            if (toast) {
                toast.success({ body: 'Finished wizard!' }, { pos: 'top-center' });
            }
        };

        return {
            handleFailed,
            handleFinished,
        };
    },
});
</script>
<template>
    <div class="container">
        <TrainResultWizard
            @failed="handleFailed"
            @finished="handleFinished"
        />
    </div>
</template>
