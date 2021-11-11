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

export default {
    components: {
        AlertMessage
    },
    data() {
        return {
            form: {
                passphrase: '',
                privateKeyFileName: 'private.pem',
                publicKeyFileName: 'public.pem'
            }
        }
    },
    created() {
        ipcRenderer.on('select-dirs-result', (event, arg) => {
            if(arg.canceled || arg.filePaths.length === 0) return;

            this.$store.dispatch('secret/setRsaPath', arg.filePaths[0]);
        });
    },
    methods: {
        selectDir() {
            ipcRenderer.send('select-dirs');
        },
        async load() {
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

            await this.$store.dispatch('secret/setRSAKeyPair', keyPair);
        },
        async generate() {
            if(!this.isDirectoryPathDefined) return;

            const raw = generateKeyPairSync('rsa', {
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

            const keyPair = {
                privateKey: raw.privateKey,
                publicKey: raw.publicKey
            }

            fs.writeFileSync(path.join(this.directoryPath, this.privateKeyFileName), keyPair.privateKey, {
                encoding: 'utf-8'
            });

            fs.writeFileSync(path.join(this.directoryPath, this.publicKeyFileName), keyPair.publicKey, {
                encoding: 'utf-8'
            });

            await this.$store.dispatch('secret/setRSAKeyPair', keyPair);
        }
    },
    computed: {
        directoryPath() {
            return this.$store.getters['secret/rsaPath'];
        },
        isDirectoryPathDefined() {
            return typeof this.directoryPath !== 'undefined';
        },

        publicKey() {
            return this.$store.getters['secret/rsaPublicKey'];
        },
        publicKeyFileName() {
            if(!this.form.publicKeyFileName || this.form.publicKeyFileName.length === 0) {
                return 'public.pem';
            }

            return this.form.publicKeyFileName;
        },

        privateKey() {
            return this.$store.getters['secret/rsaPrivateKey'];
        },
        privateKeyFileName() {
            if(!this.form.privateKeyFileName || this.form.privateKeyFileName.length === 0) {
                return 'private.pem';
            }

            return this.form.privateKeyFileName;
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
                <input v-model="form.privateKeyFileName" type="text" name="name" class="form-control" placeholder="private.pem">
            </div>
            <div class="form-group">
                <label>PublicKey file name (optional)</label>
                <input v-model="form.publicKeyFileName" type="text" name="name" class="form-control" placeholder="public.pem">
            </div>
        </div>
        <div class="col">
            <div class="d-flex flex-row justify-space-between">
                <div>
                    <button type="submit" class="btn btn-primary btn-sm" @click.prevent="load">
                        <i class="fa fa-file"></i> Load
                    </button>
                </div>
                <div class="ml-auto">
                    <button type="submit" class="btn btn-sm" :class="{'btn-dark': !privateKey && !publicKey, 'btn-danger': privateKey || publicKey}" @click.prevent="generate">
                        <i class="fa fa-wrench"></i> Generate
                    </button>
                </div>
            </div>

            <hr />

            <div class="form-group">
                <label>PrivateKey</label>
                <textarea class="form-control" v-model="privateKey" rows="8" placeholder="private key..."></textarea>
            </div>

            <div class="form-group">
                <label>PublicKey</label>
                <textarea class="form-control" v-model="publicKey" rows="8" placeholder="public key..."></textarea>
            </div>
        </div>
    </div>
</template>
