<!--
  - Copyright (c) 2021-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import type { PropType } from 'vue';
import {
    computed,
    defineComponent, ref, toRef,
} from 'vue';
import type { TrainConfig } from '@personalhealthtrain/core';
import TrainResultConfigViewer from './TrainResultConfigViewer.vue';

export default defineComponent({
    components: { TrainResultConfigViewer },
    props: {
        config: {
            type: Object as PropType<TrainConfig>,
            required: true,
        },
    },
});
</script>
<template>
    <div>
        <TrainResultConfigViewer
            v-if="config"
            :config="config"
        />
    </div>
</template>
