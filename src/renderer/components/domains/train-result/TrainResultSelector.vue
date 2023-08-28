<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { BModal } from 'bootstrap-vue-next';
import { storeToRefs } from 'pinia';
import { IPCChannel, useIPCRenderer } from '../../../core/electron';
import TrainResultInspector from './TrainResultInspector';
import { useSecretStore } from '~/store/secret';

export default defineComponent({
    components: { BModal, TrainResultInspector },
    setup() {
        const tarFile = ref('');

        const store = useSecretStore();
        const storeRefs = storeToRefs(store);
        const privateKey = storeRefs.defaultPrivateKey;

        const modalNode = ref<boolean>(null);

        const selectFile = async () => {
            const output = await useIPCRenderer().invoke(IPCChannel.RESULT_FILE_SELECT);

            if (output.canceled || output.filePaths.length === 0) return;

            [tarFile.value] = output.filePaths;

            modalNode.value = true;
        };

        const hide = () => {
            modalNode.value = false;
        };

        return {
            privateKey,
            selectFile,
            modalNode,
            tarFile,
            hide,
        };
    },
});
</script>
<template>
    <div>
        <div>
            <div class="form-group">
                <button
                    type="submit"
                    class="btn btn-block btn-primary btn-sm pt-4 pb-4"
                    :disabled="!privateKey"
                    @click.prevent="selectFile"
                >
                    <h4><i class="fa fa-file-archive mr-2" /> Select Result-File <small>(.tar)</small></h4>
                </button>
            </div>
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
                <i class="fa fa-search" /> Inspector
            </template>
            <TrainResultInspector
                :source="tarFile"
                :source-option="'file'"
                @finished="hide"
            />
        </BModal>
    </div>
</template>
