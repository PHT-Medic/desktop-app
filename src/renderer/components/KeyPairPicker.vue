<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script>
import path from 'path';
import * as fs from 'fs';
import {generateKeyPairSync} from 'crypto';
import {ipcRenderer} from 'electron';

import AlertMessage from "./alert/AlertMessage";
import {KeyPicker} from "../modules/key-picker/type";

export default {
    props: {
        type: KeyPicker
    },
    components: {
        AlertMessage
    },
    data() {
        return {
            listener: null,
            form: {
                passphrase: '',
                privateKeyFileName: this.privateKeyFileName,
                publicKeyFileName: this.publicKeyFileName
            }
        }
    },
    created() {
        this.listener = (event, arg) => {
            if(arg.canceled || arg.filePaths.length === 0) return;

            switch (this.type) {
                case KeyPicker.HOMOMORPHIC_ENCRYPTION:
                    this.$store.dispatch('secret/setHePath', arg.filePaths[0]);
                    break;
                case KeyPicker.DEFAULT:
                    this.$store.dispatch('secret/setDefaultPath', arg.filePaths[0]);
                    break;
            }

        };

        ipcRenderer.on('select-dirs-result', this.listener);
    },
    beforeDestroy() {
        ipcRenderer.removeListener('select-dirs-result', this.listener);
    },
    methods: {
        selectDir() {
            ipcRenderer.send('select-dirs');
        },
        async load() {
            if(!this.isDirectoryPathDefined) return;

            const privateKeyPath = path.join(this.directoryPath, this.privateKeyFileName);
            const publicKeyPath = path.join(this.directoryPath, this.publicKeyFileName);

            let keyPair = {};

            try {
                await fs.promises.access(privateKeyPath, fs.constants.F_OK);
                keyPair.privateKey = await fs.promises.readFile(privateKeyPath);
            } catch (e) {
                // do nothing
            }

            try {
                await fs.promises.access(publicKeyPath, fs.constants.F_OK);
                keyPair.publicKey = await fs.promises.readFile(publicKeyPath);
            } catch (e) {
                // do nothing
            }

            switch (this.type) {
                case KeyPicker.HOMOMORPHIC_ENCRYPTION:
                    await this.$store.dispatch('secret/setHeKeyPair', keyPair);
                    break;
                case KeyPicker.DEFAULT:
                    await this.$store.dispatch('secret/setDefaultKeyPair', keyPair);
                    break;
            }
        },
        async generate() {
            if(!this.isDirectoryPathDefined) return;

            let keyPair = {
                privateKey: '',
                publicKey: ''
            }

            switch (this.type) {
                case KeyPicker.HOMOMORPHIC_ENCRYPTION:
                    // todo :)
                    break;
                case KeyPicker.DEFAULT:
                    keyPair = generateKeyPairSync('rsa', {
                        modulusLength: 2048,
                        publicKeyEncoding: {
                            type: 'pkcs1',
                            format: 'pem'
                        },
                        privateKeyEncoding: {
                            type: 'pkcs8',
                            format: 'pem',
                            cipher: 'aes-192-cbc',
                            passphrase: this.form.passphrase
                        }
                    });
                    break;
            }

            fs.writeFileSync(path.join(this.directoryPath, this.privateKeyFileName), keyPair.privateKey, {
                encoding: 'utf-8'
            });

            fs.writeFileSync(path.join(this.directoryPath, this.publicKeyFileName), keyPair.publicKey, {
                encoding: 'utf-8'
            });

            switch (this.type) {
                case KeyPicker.HOMOMORPHIC_ENCRYPTION:
                    await this.$store.dispatch('secret/setHeKeyPair', keyPair);
                    break;
                case KeyPicker.DEFAULT:
                    await this.$store.dispatch('secret/setDefaultKeyPair', keyPair);
                    break;
            }
        }
    },
    computed: {
        directoryPath() {
            switch (this.type) {
                case KeyPicker.HOMOMORPHIC_ENCRYPTION:
                    return this.$store.getters['secret/hePath'];
                case KeyPicker.DEFAULT:
                    return this.$store.getters['secret/defaultPath'];
            }

            return '';
        },
        isDirectoryPathDefined() {
            return typeof this.directoryPath !== 'undefined';
        },

        publicKey() {
            switch (this.type) {
                case KeyPicker.HOMOMORPHIC_ENCRYPTION:
                    return this.$store.getters['secret/hePublicKey'];
                case KeyPicker.DEFAULT:
                    return this.$store.getters['secret/defaultPublicKey'];
            }
        },
        publicKeyFileName() {
            if(!this.form.publicKeyFileName || this.form.publicKeyFileName.length === 0) {
                return this.publicKeyDefaultFileName;
            }

            return this.form.publicKeyFileName;
        },
        publicKeyDefaultFileName() {
            switch (this.type) {
                case KeyPicker.HOMOMORPHIC_ENCRYPTION:
                    return 'public-he.key';
                case KeyPicker.DEFAULT:
                    return 'public.pem';
            }
        },

        privateKey() {
            switch (this.type) {
                case KeyPicker.HOMOMORPHIC_ENCRYPTION:
                    return this.$store.getters['secret/hePrivateKey'];
                case KeyPicker.DEFAULT:
                    return this.$store.getters['secret/defaultPrivateKey'];
            }
        },
        privateKeyFileName() {
            if(!this.form.privateKeyFileName || this.form.privateKeyFileName.length === 0) {
                return this.privateKeyDefaultFileName;
            }

            return this.form.privateKeyFileName;
        },
        privateKeyDefaultFileName() {
            switch (this.type) {
                case KeyPicker.HOMOMORPHIC_ENCRYPTION:
                    return 'private-he.key';
                case KeyPicker.DEFAULT:
                    return 'private.pem';
            }
        }
    }
}
</script>
<template>
    <div class="row">
        <div class="col">
            <div class="form-group">
                <button type="submit" class="btn btn-primary btn-sm" @click.prevent="selectDir">
                    <i class="fa fa-file-archive"></i> Choose path
                </button>
            </div>

            <div class="form-group">
                <label>Directory Path</label>
                <input v-model="directoryPath" type="text" name="name" class="form-control" :disabled="true" placeholder="...">
            </div>

            <hr />

            <div class="form-group">
                <label>Passphrase (optional)</label>
                <input v-model="form.passphrase" type="text" name="name" class="form-control" placeholder="...">
            </div>

            <div class="form-group">
                <label>PrivateKey file name (optional)</label>
                <input v-model="form.privateKeyFileName" type="text" name="name" class="form-control" :placeholder="privateKeyDefaultFileName">
            </div>
            <div class="form-group">
                <label>PublicKey file name (optional)</label>
                <input v-model="form.publicKeyFileName" type="text" name="name" class="form-control" :placeholder="publicKeyDefaultFileName">
            </div>
        </div>
        <div class="col">
            <div class="d-flex flex-row justify-space-between">
                <div>
                    <button type="submit" class="btn btn-primary btn-sm" @click.prevent="load" :disabled="!isDirectoryPathDefined">
                        <i class="fa fa-file"></i> Load
                    </button>
                </div>
                <div class="ml-auto">
                    <button type="submit" class="btn btn-sm" :class="{'btn-dark': !privateKey && !publicKey, 'btn-danger': privateKey || publicKey}" @click.prevent="generate" :disabled="!isDirectoryPathDefined">
                        <i class="fa fa-wrench"></i> Generate
                    </button>
                </div>
            </div>

            <hr />

            <div class="form-group">
                <label>PrivateKey</label>
                <textarea class="form-control" v-model="privateKey" rows="8" placeholder="..."></textarea>
            </div>

            <div class="form-group">
                <label>PublicKey</label>
                <textarea class="form-control" v-model="publicKey" rows="8" placeholder="..."></textarea>
            </div>
        </div>
    </div>
</template>
