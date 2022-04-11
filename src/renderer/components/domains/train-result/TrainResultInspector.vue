<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script>
import path from 'path';
import { PrivateKey, PublicKey } from 'paillier-bigint';
import { readTrainResult } from '../../../domains/train-result/module';
import { TrainResultInspectorStatusOption, TrainResultSourceType } from '../../../domains/train-result/constants';
import AlertMessage from '../../alert/AlertMessage';
import TrainResultConfigViewer from './TrainResultConfigViewer';
import TarFilesSaver from '../../TarFilesSaver';

export default {
    components: { TarFilesSaver, TrainResultConfigViewer, AlertMessage },
    props: {
        source: String,
        sourceOption: {
            type: String,
            default: TrainResultSourceType.FILE,
        },
    },
    data() {
        return {
            sourceOptions: TrainResultSourceType,

            statusOptions: TrainResultInspectorStatusOption,
            status: null,

            message: null,

            config: null,
            files: [],
        };
    },
    computed: {
        optionActionLabel() {
            return this.sourceOption === TrainResultSourceType.FILE ?
                'Load' :
                'Download';
        },
        optionLabel() {
            return this.sourceOption === TrainResultSourceType.FILE ?
                'FilePath' :
                'URL';
        },
        optionIcon() {
            return this.sourceOption === TrainResultSourceType.FILE ?
                'fa fa-file-upload' :
                'fa fa-file-download';
        },

        privateKey() {
            return this.$store.getters['secret/defaultPrivateKey'];
        },

        destinationPath() {
            let id;

            if(
                this.config &&
                this.config.id
            ) {
                id = this.config.id;
            }

            if(
                this.config &&
                this.config['@id']
            ) {
                id = this.config['@id'];
            }

            if (
                id &&
                this.sourceOption === TrainResultSourceType.FILE
            ) {
                return path.join(this.source, '..', id);
            }

            return undefined;
        },
    },
    methods: {
        async run() {
            if (!this.privateKey && !this.isTarFileDefined) return;

            this.status = TrainResultInspectorStatusOption.DECRYPTING;

            try {
                let paillierKey;

                if (
                    this.$store.getters['secret/hePrivateKey'] &&
                    this.$store.getters['secret/hePublicKey']
                ) {
                    const publicData = this.$store.getters['secret/hePublicKey'];
                    const privateData = this.$store.getters['secret/hePrivateKey'];

                    const publicKey = new PublicKey(BigInt(publicData.n), BigInt(publicData.g));
                    paillierKey = new PrivateKey(
                        BigInt(privateData.lambda),
                        BigInt(privateData.mu),
                        publicKey,
                    );
                }

                const { config, files } = await readTrainResult({
                    source: this.source,
                    sourceType: this.sourceOption,
                    rsaPrivateKey: this.privateKey,
                    paillierPrivateKey: paillierKey
                });

                this.config = config;
                this.files = files;

                this.status = TrainResultInspectorStatusOption.DECRYPTED;

                this.$nextTick(() => {
                    if (this.$refs.filesSaver) {
                        this.$refs.filesSaver.init();
                    }
                });

                this.message = null;
            } catch (e) {
                this.message = {
                    data: e.message,
                    isError: true,
                };

                this.status = TrainResultInspectorStatusOption.FAILED;
            }
        },
    },
};
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
                ref="filesSaver"
                :items-property="files"
                :destination-path-property="destinationPath"
            />
        </div>
    </div>
</template>
