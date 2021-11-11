<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<template>
    <div>
        <div class="alert alert-danger alert-sm" v-if="!privateKey">
            You first have to load your private and public key or generate them...
        </div>

        <div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary btn-sm" @click.prevent="selectFiles">
                    <i class="fa fa-file-archive"></i> Choose files
                </button>
            </div>

            <div class="form-group">
                <label>Files</label>

                <div class="d-flex flex-column">
                    <div class="card card-file d-flex flex-row align-items-center" v-for="(item,key) in fileNames" :key="key">
                        <div class="card-body">
                            <span class="title">
                                {{item}}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Passphrase</label>
                <input type="text" class="form-control" v-model="passphrase"  placeholder="..." />
            </div>

            <button :disabled="!privateKey" type="submit" class="btn btn-dark btn-sm"  @click.prevent="decrypt">
                <i class="fa fa-file-code"></i> Decrypt
            </button>
        </div>
    </div>
</template>
<script>
import {ipcRenderer} from "electron";
import path from "path";

export default {
    data() {
        return {
            files: [],
            hash: '',
            passphrase: '',
        }
    },
    created() {
        ipcRenderer.on('select-files-result', (event, arg) => {
            if(arg.canceled || arg.filePaths.length === 0) return;

            this.files = arg.filePaths;
        });
    },
    methods: {
        async selectFiles() {
            ipcRenderer.send('select-files');
        },
        async decrypt() {
            if(!this.privateKey) return;

        }
    },
    computed: {
        directoryPath() {
            return this.$store.getters['secret/defaultPath'];
        },
        isDirectoryPathDefined() {
            return typeof this.directoryPath !== 'undefined';
        },

        privateKey() {
            return this.$store.getters['secret/defaultPrivateKey'];
        },

        fileNames() {
            return this.files.map(file => path.basename(file));
        }
    }
}
</script>
