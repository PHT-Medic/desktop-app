<!--
  - Copyright (c) 2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { wrapFnWithBusyState } from '@personalhealthtrain/client-vue';
import { defineComponent, ref } from 'vue';
import { IPCChannel, useIPCRenderer } from '../core/electron';

export default defineComponent({
    emits: ['selected'],
    setup(props, { emit, expose }) {
        const busy = ref(false);
        const path = ref<string | null>(null);
        const select = wrapFnWithBusyState(busy, async () => {
            const output = await useIPCRenderer().invoke(IPCChannel.RESULT_FILE_SELECT);

            if (output.canceled || output.filePaths.length === 0) return;

            [path.value] = output.filePaths;

            emit('selected', output.filePaths[0]);
        });

        const reset = () => {
            path.value = null;
        };

        expose({
            reset,
        });

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
                <i class="fa fa-file" />
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
