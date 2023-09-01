<!--
  - Copyright (c) 2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { TarFile } from '../../../core';
import type TarFilesSaver from '../TarFilesSaver.vue';

export default defineComponent({
    props: {
        files: {
            type: Array as PropType<TarFile[]>,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
    },
    emits: ['saved', 'failed'],
    setup(props, { emit, expose }) {
        const handleSaved = () => {
            emit('saved');
        };

        const handleFailed = (e: Error) => {
            emit('failed', e);
        };

        const node = ref<null | typeof TarFilesSaver>(null);
        const save = async () => {
            if (!node.value) {
                return;
            }

            await node.value.save();
        };

        expose({
            save,
        });

        return {
            node,
            save,
            handleSaved,
            handleFailed,
        };
    },
});
</script>
<template>
    <TarFilesSaver
        :id="id"
        ref="node"
        :items="files"
        :display-button="false"
        @saved="handleSaved"
        @failed="handleFailed"
    />
</template>
