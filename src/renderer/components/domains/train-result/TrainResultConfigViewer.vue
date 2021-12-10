<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script>
export default {
    props: {
        config: Object,
    },
};
</script>
<template>
    <div class="train-result-config-viewer">
        <strong>Train ID</strong> {{ config.train_id }} <br>
        <strong>Master Image</strong> {{ config.master_image }} <br>
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
