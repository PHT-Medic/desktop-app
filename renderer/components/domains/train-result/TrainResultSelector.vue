<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script>
import { ipcRenderer } from 'electron';
import path from 'path';
import TrainResultInspector from './TrainResultInspector';

export default {
    components: { TrainResultInspector },
    data() {
        return {
            tarFile: '',
            result: '',

            hash: '',
            passphrase: '',
        };
    },
    computed: {
        isTarFileDefined() {
            return !!this.tarFile && this.tarFile.length > 0;
        },

        privateKey() {
            return this.$store.getters['secret/defaultPrivateKey'];
        },

        isPassphraseDefined() {
            return !!this.passphrase && this.passphrase.length > 0;
        },

        fileNames() {
            return this.files.map((file) => path.basename(file));
        },
    },
    created() {
        ipcRenderer.on('result-file-selected', async (event, arg) => {
            if (arg.canceled || arg.filePaths.length === 0) return;

            // eslint-disable-next-line prefer-destructuring
            this.tarFile = arg.filePaths[0];

            if (this.$refs.inspector) {
                this.$refs.inspector.show();
            }
        });
    },
    methods: {
        async selectFile() {
            ipcRenderer.send('result-file-select');
        },
        async inspect() {
            if (!this.isTarFileDefined || !this.privateKey) return;

            this.$refs.inspector.show();
        },
        async hideModal() {
            this.$refs.inspector.hide();
        },
    },
};
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

        <b-modal
            ref="inspector"
            size="lg"
            button-size="sm"
            title-html="<i class='fa fa-search'></i> Inspector"
            :no-close-on-backdrop="true"
            :no-close-on-esc="true"
            :hide-footer="true"
        >
            <train-result-inspector
                :source="tarFile"
                :source-option="'file'"
                @finished="hideModal"
            />
        </b-modal>
    </div>
</template>
