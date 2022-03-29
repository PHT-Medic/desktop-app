<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {PropType} from "vue";
import {TrainConfig} from "@personalhealthtrain/central-common";

export default {
    props: {
        config: Object as PropType<TrainConfig>,
    },
};
</script>
<template>
    <div class="train-result-config-viewer">
        <strong>Train ID</strong> {{ config.id }} <br>
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
