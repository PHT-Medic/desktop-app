<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { TrainConfig } from '@personalhealthtrain/core';

export default defineComponent({
    props: {
        config: Object as PropType<TrainConfig>,
    },
});
</script>
<template>
    <div class="train-result-config-viewer">
        <strong>Proposal ID</strong> {{ config.proposal_id }} <br>
        <strong>Train ID</strong> {{ config['@id'] || config.id }} <br>
        <strong>Master Image</strong> {{ config.source.address }} <br>
        <strong>Session ID</strong> {{ config.session_id }} <br>
    </div>
</template>
<style>
.train-result-config-viewer {
    text-overflow: fade;
    word-break: break-all;
    max-width: 100%;
}
</style>
