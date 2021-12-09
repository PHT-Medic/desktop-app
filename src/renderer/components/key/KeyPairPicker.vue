<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script>
import path from 'path';
import * as fs from 'fs';
import { generateKeyPairSync } from 'crypto';
import { ipcRenderer } from 'electron';
import * as paillierBigint from 'paillier-bigint';
import { KeyPairVariant } from '../../modules/key-picker/type';
import KeyDisplay from './KeyDisplay';

export default {
    components: { KeyDisplay },
    props: {
        variant: KeyPairVariant,
    },
    data() {
        return {
            dirListener: null,
            form: {
                passphrase: '',
                privateKeyFileName: '',
                publicKeyFileName: '',
            },
        };
    },
    computed: {
        isPassphraseDefined() {
            return !!this.form.passphrase && this.form.passphrase.length !== 0;
        },
        isPassphraseRequired() {
            return this.variant === KeyPairVariant.DEFAULT;
        },

        directoryPath() {
            switch (this.variant) {
                case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                    return this.$store.getters['secret/hePath'];
                case KeyPairVariant.DEFAULT:
                    return this.$store.getters['secret/defaultPath'];
            }

            return '';
        },
        isDirectoryPathDefined() {
            return typeof this.directoryPath !== 'undefined';
        },

        publicKey() {
            switch (this.variant) {
                case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                    return this.$store.getters['secret/hePublicKey'];
                default:
                    return this.$store.getters['secret/defaultPublicKey'];
            }
        },
        publicKeyFileName() {
            if (!this.form.publicKeyFileName || this.form.publicKeyFileName.length === 0) {
                return this.publicKeyDefaultFileName;
            }

            return this.form.publicKeyFileName;
        },
        publicKeyDefaultFileName() {
            switch (this.variant) {
                case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                    return 'public-he.key';
                default:
                    return 'public.pem';
            }
        },

        privateKey() {
            switch (this.variant) {
                case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                    return this.$store.getters['secret/hePrivateKey'];
                default:
                    return this.$store.getters['secret/defaultPrivateKey'];
            }
        },
        privateKeyFileName() {
            if (!this.form.privateKeyFileName || this.form.privateKeyFileName.length === 0) {
                return this.privateKeyDefaultFileName;
            }

            return this.form.privateKeyFileName;
        },
        privateKeyDefaultFileName() {
            switch (this.variant) {
                case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                    return 'private-he.key';
                default:
                    return 'private.pem';
            }
        },
    },
    created() {
        this.form.privateKeyFileName = this.privateKeyFileName;
        this.form.publicKeyFileName = this.publicKeyFileName;

        this.dirListener = (event, arg) => {
            if (arg.canceled || arg.filePaths.length === 0) return;

            switch (this.variant) {
                case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                    this.$store.dispatch('secret/setHePath', arg.filePaths[0]);
                    break;
                default:
                    this.$store.dispatch('secret/setDefaultPath', arg.filePaths[0]);
                    break;
            }
        };

        ipcRenderer.on('dir-selected', this.dirListener);
    },
    beforeDestroy() {
        ipcRenderer.removeListener('dir-selected', this.dirListener);
    },
    methods: {
        selectDir() {
            ipcRenderer.send('dir-select');
        },
        async load() {
            if (!this.isDirectoryPathDefined) return;

            const privateKeyPath = path.join(this.directoryPath, this.privateKeyFileName);
            const publicKeyPath = path.join(this.directoryPath, this.publicKeyFileName);

            const keyPair = {};

            try {
                await fs.promises.access(privateKeyPath, fs.constants.F_OK);
                keyPair.privateKey = await fs.promises.readFile(privateKeyPath);
            } catch (e) {
                this.$bvToast.toast('The private key could not be found or be read.', {
                    variant: 'warning',
                    toaster: 'b-toaster-top-center',
                });

                return;
                // do nothing
            }

            try {
                await fs.promises.access(publicKeyPath, fs.constants.F_OK);
                keyPair.publicKey = await fs.promises.readFile(publicKeyPath);
            } catch (e) {
                this.$bvToast.toast('The public key could not be found or be read.', {
                    variant: 'warning',
                    toaster: 'b-toaster-top-center',
                });

                return;
                // do nothing
            }

            switch (this.variant) {
                case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                    await this.$store.dispatch('secret/setHeKeyPair', keyPair);
                    break;
                case KeyPairVariant.DEFAULT:
                    await this.$store.dispatch('secret/setDefaultKeyPair', keyPair);
                    break;
            }

            this.$bvToast.toast('The key pair was successfully loaded.', {
                variant: 'success',
                toaster: 'b-toaster-top-center',
            });
        },
        async generate() {
            if (!this.isDirectoryPathDefined) return;

            let keyPair = {
                privateKey: '',
                publicKey: '',
            };

            try {
                switch (this.variant) {
                    case KeyPairVariant.HOMOMORPHIC_ENCRYPTION: {
                        const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(128);

                        // eslint-disable-next-line no-extend-native
                        BigInt.prototype.toJSON = function () {
                            return this.toString();
                        };

                        keyPair.publicKey = JSON.stringify({
                            n: publicKey.n,
                            g: publicKey.g,
                        });

                        keyPair.privateKey = JSON.stringify({
                            mu: privateKey.mu,
                            lambda: privateKey.lambda,
                        });
                        break;
                    }
                    case KeyPairVariant.DEFAULT:
                        keyPair = generateKeyPairSync('rsa', {
                            modulusLength: 2048,
                            publicKeyEncoding: {
                                type: 'pkcs1',
                                format: 'pem',
                            },
                            privateKeyEncoding: {
                                type: 'pkcs8',
                                format: 'pem',
                                cipher: 'aes-192-cbc',
                                passphrase: this.form.passphrase,
                            },
                        });
                        break;
                }
            } catch (e) {
                this.$bvToast.toast('The key pair could not be generated.', {
                    variant: 'warning',
                    toaster: 'b-toaster-top-center',
                });

                return;
            }

            try {
                fs.writeFileSync(path.join(this.directoryPath, this.privateKeyFileName), keyPair.privateKey, {
                    encoding: 'utf-8',
                });

                fs.writeFileSync(path.join(this.directoryPath, this.publicKeyFileName), keyPair.publicKey, {
                    encoding: 'utf-8',
                });
            } catch (e) {
                this.$bvToast.toast('The key pair could not be written to the specified directory.', {
                    variant: 'warning',
                    toaster: 'b-toaster-top-center',
                });

                return;
            }

            switch (this.variant) {
                case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                    await this.$store.dispatch('secret/setHeKeyPair', keyPair);
                    break;
                case KeyPairVariant.DEFAULT:
                    await this.$store.dispatch('secret/setDefaultKeyPair', keyPair);
                    break;
            }

            this.$bvToast.toast('The key pair was successfully generated.', {
                variant: 'success',
                toaster: 'b-toaster-top-center',
            });
        },
    },
};
</script>
<template>
    <div class="row">
        <div class="col">
            <div
                class="form-group"
                :class="{ 'form-group-error': !isDirectoryPathDefined }"
            >
                <label>Directory Path</label>
                <input
                    v-model="directoryPath"
                    type="text"
                    name="name"
                    class="form-control"
                    :disabled="true"
                    placeholder="..."
                >

                <div
                    v-if="!isDirectoryPathDefined"
                    class="form-group-hint group-required"
                >
                    Select a directory path.
                </div>
            </div>

            <div class="d-flex flex-row justify-space-between mb-2">
                <div>
                    <button
                        type="submit"
                        class="btn btn-dark btn-sm"
                        @click.prevent="selectDir"
                    >
                        <i class="fa fa-file" /> Select directory
                    </button>
                </div>
                <div class="ml-auto">
                    <button
                        type="submit"
                        class="btn btn-primary btn-sm"
                        :disabled="!isDirectoryPathDefined"
                        @click.prevent="load"
                    >
                        <i class="fa fa-sync" /> Load key-pair
                    </button>
                </div>
            </div>

            <hr>

            <div
                v-if="isPassphraseRequired"
                class="form-group"
                :class="{ 'form-group-error': !isPassphraseDefined }"
            >
                <label>Passphrase</label>
                <input
                    v-model="form.passphrase"
                    type="text"
                    name="name"
                    class="form-control"
                    placeholder="..."
                >

                <div
                    v-if="isPassphraseRequired && !isPassphraseDefined"
                    class="form-group-hint group-required"
                >
                    Enter a passphrase.
                </div>
            </div>

            <div class="form-group">
                <label>PrivateKey file name (optional)</label>
                <input
                    v-model="form.privateKeyFileName"
                    type="text"
                    name="name"
                    class="form-control"
                    :placeholder="privateKeyDefaultFileName"
                >
            </div>
            <div class="form-group">
                <label>PublicKey file name (optional)</label>
                <input
                    v-model="form.publicKeyFileName"
                    type="text"
                    name="name"
                    class="form-control"
                    :placeholder="publicKeyDefaultFileName"
                >
            </div>

            <hr>

            <button
                type="submit"
                class="btn btn-sm"
                :class="{
                    'btn-dark': !privateKey && !publicKey,
                    'btn-danger': privateKey || publicKey
                }"
                :disabled="!isDirectoryPathDefined || (isPassphraseRequired && !isPassphraseDefined)"
                @click.prevent="generate"
            >
                <i class="fa fa-wrench" /> Generate key-pair
            </button>
        </div>
        <div class="col">
            <key-display
                :key-pair-variant="variant"
                :key-variant="'private'"
            />

            <key-display
                :key-pair-variant="variant"
                :key-variant="'public'"
            />
        </div>
    </div>
</template>
