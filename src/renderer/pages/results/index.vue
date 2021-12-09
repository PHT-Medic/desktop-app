<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<template>
    <div>
        <h1 class="title no-border mb-2">
            <i class="fas fa-file-download" /> Result
        </h1>

        <alert-message :message="message" />

        <div
            v-if="!privateKey"
            class="alert alert-danger alert-sm"
        >
            You first have to load your private and public key or generate them...<br>
            <nuxt-link
                type="button"
                class="btn btn-dark btn-xs"
                :to="'/settings/secrets'"
            >
                <i class="fa fa-cog" /> Settings
            </nuxt-link>
        </div>

        <hr>

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

            <div class="form-group">
                <label>File</label>
                <input
                    type="text"
                    class="form-control"
                    :disabled="true"
                    :value="tarFile"
                    placeholder="*.tar"
                >
            </div>

            <hr>

            <div class="form-group">
                <label>Passphrase</label>
                <input
                    v-model="passphrase"
                    type="text"
                    class="form-control"
                    placeholder="..."
                >
            </div>

            <button
                :disabled="!privateKey || !isTarFileDefined"
                type="submit"
                class="btn btn-dark btn-sm"
                @click.prevent="decrypt"
            >
                <i class="fa fa-file-code" /> Decrypt
            </button>
        </div>

        <hr>

        <div class="form-group">
            <label>Result</label>
            <textarea
                rows="8"
                class="form-control"
                :value="result"
                :disabled="true"
                placeholder="{...}"
            />
        </div>
    </div>
</template>
<script>
import { ipcRenderer } from 'electron';
import path from 'path';
import { readTrainResult } from '../../domains/train-result/module';
import AlertMessage from '../../components/alert/AlertMessage';
import { LayoutKey, LayoutNavigationID } from '../../config/layout/contants';

export default {
    meta: {
        [LayoutKey.NAVIGATION_ID]: LayoutNavigationID.DEFAULT,
    },
    components: { AlertMessage },
    data() {
        return {
            message: null,

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

        directoryPath() {
            return this.$store.getters['secret/defaultPath'];
        },
        isDirectoryPathDefined() {
            return typeof this.directoryPath !== 'undefined';
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

            this.tarFile = arg.filePaths[0];
        });
    },
    methods: {
        async selectFile() {
            ipcRenderer.send('result-file-select');
        },
        async decrypt() {
            if (!this.privateKey && !this.isTarFileDefined) return;

            try {
                this.result = await readTrainResult({
                    filePath: this.tarFile,
                    privateKey: this.privateKey,
                    passphrase: this.passphrase,
                });

                this.message = {
                    isError: false,
                    data: 'The compressed train file was successfully decompressed.',
                };
            } catch (e) {
                this.message = {
                    data: e.message,
                    isError: true,
                };
            }
        },
    },
};
</script>
