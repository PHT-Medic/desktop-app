<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import type { TrainFile } from '@personalhealthtrain/client-vue';
import type { TrainConfig } from '@personalhealthtrain/core';
import { join } from 'pathe';
import type { ResguardResult } from 'resguard';
import {
    computed, defineComponent, nextTick, ref,
} from 'vue';
import { PrivateKey, PublicKey } from 'paillier-bigint';
import { storeToRefs } from 'pinia';
import { TrainResultInspectorStatusOption, TrainResultSourceType } from '../../../../main/domains/train-result/constants';
import type { TrainResultOutput } from '../../../../main/domains/train-result/type';
import { IPCChannel, useIPCRenderer } from '../../../core/electron';
import AlertMessage from '../../alert/AlertMessage';
import TrainResultConfigViewer from './TrainResultConfigViewer';
import TarFilesSaver from '../../TarFilesSaver';
import { useSecretStore } from '~/store/secret';

export default defineComponent({
    components: { TarFilesSaver, TrainResultConfigViewer, AlertMessage },
    props: {
        source: String,
        sourceOption: {
            type: String,
            default: TrainResultSourceType.FILE,
        },
    },
    setup(props) {
        const sourceOptions = TrainResultSourceType;
        const status = ref(null);
        const message = ref(null);
        const config = ref<null | TrainConfig>(null);
        const files = ref<TrainFile[]>([]);
        const filesSaver = ref<typeof TarFilesSaver | null>(null);

        const store = useSecretStore();
        const storeRefs = storeToRefs(store);

        const optionLabel = computed(() => (props.sourceOption === TrainResultSourceType.FILE ?
            'FilePath' :
            'URL'));

        const optionIcon = computed(() => (props.sourceOption === TrainResultSourceType.FILE ?
            'fa fa-file-upload' :
            'fa fa-file-download'));

        const privateKey = storeRefs.defaultPrivateKey;

        const destinationPath = computed(() => {
            let id;

            if (
                config.value &&
            config.value.id
            ) {
                id = config.value.id;
            }

            if (
                config.value &&
            config.value['@id']
            ) {
                id = config.value['@id'];
            }

            if (id && props.sourceOption === TrainResultSourceType.FILE) {
                return join(props.source, '..', id);
            }

            return undefined;
        });

        const run = async () => {
            if (!privateKey.value) return;

            status.value = TrainResultInspectorStatusOption.DECRYPTING;

            try {
                let paillierKey;

                if (
                    storeRefs.hePrivateKey.value &&
                    storeRefs.hePublicKey.value
                ) {
                    const publicData = storeRefs.hePublicKey.value;
                    const privateData = storeRefs.hePrivateKey.value;

                    const publicKey = new PublicKey(BigInt(publicData.n), BigInt(publicData.g));
                    paillierKey = new PrivateKey(
                        BigInt(privateData.lambda),
                        BigInt(privateData.mu),
                        publicKey,
                    );
                }

                const { error, data } = await useIPCRenderer().invoke(IPCChannel.RESULT_READ, {
                    source: props.source,
                    sourceType: props.sourceOption,
                    rsaPrivateKey: privateKey.value,
                    paillierPrivateKey: paillierKey,
                }) as ResguardResult<TrainResultOutput>;

                if (error) {
                    message.value = {
                        data: error.message,
                        isError: true,
                    };
                }

                config.value = data.config;
                files.value = data.files;

                status.value = TrainResultInspectorStatusOption.DECRYPTED;

                nextTick(() => {
                    if (filesSaver.value) {
                        filesSaver.value.init();
                    }
                });

                message.value = null;
            } catch (e) {
                status.value = TrainResultInspectorStatusOption.FAILED;
            }
        };

        return {
            sourceOptions,
            optionIcon,
            optionLabel,
            privateKey,
            run,
            config,
            message,
            filesSaver,
            files,
            destinationPath,
        };
    },
});
</script>
<template>
    <div>
        <div class="row">
            <div class="col">
                <h6>
                    <i :class="optionIcon" /> Loader
                </h6>

                <div class="alert alert-info alert-sm">
                    <template
                        v-if="sourceOption === sourceOptions.FILE"
                    >
                        Load the compressed & encrypted result file in memory. Decompress and decrypt it there and only
                        download the files you want.
                    </template>
                    <template v-else>
                        Download the compressed & encrypted result file in memory. Decompress and decrypt it there and only
                        download the files you want.
                    </template>
                </div>

                <div class="form-group">
                    <label>{{ optionLabel }}</label>
                    <input
                        type="text"
                        class="form-control"
                        :disabled="true"
                        :value="source"
                        placeholder="..."
                    >
                </div>

                <button
                    :disabled="!privateKey"
                    type="submit"
                    class="btn btn-dark btn-sm"
                    @click.prevent="run"
                >
                    <i class="fas fa-play pr-1" /> Load
                </button>
            </div>

            <div
                v-if="config"
                class="col"
            >
                <h6><i class="fas fa-cogs" /> Configuration</h6>
                <train-result-config-viewer :config="config" />
            </div>
        </div>

        <hr>

        <alert-message :message="message" />

        <div v-if="config">
            <h6>
                <i class="fas fa-bars" /> FileBrowser
            </h6>

            <tar-files-saver
                :ref="filesSaver"
                :items="files"
                :destination-path="destinationPath"
            />
        </div>
    </div>
</template>
