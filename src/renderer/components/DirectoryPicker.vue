<!--
  - Copyright (c) 2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IPCChannel, useIPCRenderer } from '../core/electron';

export default defineComponent({
    emits: ['selected'],
    setup(props, { emit }) {
        const path = ref<string | null>(null);
        const select = async () => {
            const output = await useIPCRenderer().invoke(IPCChannel.DIR_SELECT);

            if (output.canceled || output.filePaths.length === 0) return;

            path.value = output.filePaths[0];

            emit('selected', output.filePaths[0]);
        };

        return {
            select,
            path,
        };
    },
});
</script>
<template>
    <div class="input-group">
        <div class="input-group-prepend">
            <button
                type="submit"
                class="btn btn-dark btn-sm"
                @click.prevent="select"
            >
                <i class="fa fa-folder" />
            </button>
        </div>

        <input
            v-model="path"
            type="text"
            name="name"
            class="form-control"
            :disabled="true"
            placeholder="..."
            @click.prevent="select"
        >
    </div>
</template>
