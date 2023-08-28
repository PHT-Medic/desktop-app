<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { join } from 'pathe';
import { useToast } from 'bootstrap-vue-next';
import { isHex } from '@personalhealthtrain/core';
import { storeToRefs } from 'pinia';
import type { PropType } from 'vue';
import {
    computed, defineComponent, reactive,
} from 'vue';
import { KeyPairVariant } from './constants';
import { IPCChannel, useIPCRenderer } from '../../core/electron';
import { useSecretStore } from '../../store/secret';
import KeyDisplay from './KeyDisplay.vue';

export default defineComponent({
    components: { KeyDisplay },
    props: {
        variant: String as PropType<`${KeyPairVariant}`>,
    },
    setup(props) {
        const toast = useToast();
        const store = useSecretStore();
        const storeRefs = storeToRefs(store);

        const form = reactive({
            passphrase: '',
            privateKeyFileName: '',
            publicKeyFileName: '',
        });

        const isPassphraseDefined = computed(() => !!form.passphrase && form.passphrase.length !== 0);

        const isPassphraseRequired = computed(() => props.variant === KeyPairVariant.DEFAULT);

        const directoryPath = computed(() => {
            switch (props.variant) {
                case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                    return storeRefs.hePath.value;
                case KeyPairVariant.DEFAULT:
                    return storeRefs.defaultPath.value;
            }

            return '';
        });

        const isDirectoryPathDefined = computed(() => typeof directoryPath.value !== 'undefined');

        const publicKey = computed(() => {
            switch (props.variant) {
                case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                    return storeRefs.hePublicKey.value;
                default:
                    return storeRefs.defaultPublicKey.value;
            }
        });

        const publicKeyDefaultFileName = computed(() => {
            switch (props.variant) {
                case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                    return 'public-he.key';
                default:
                    return 'public.pem';
            }
        });

        const publicKeyFileName = computed(() => {
            if (!form.publicKeyFileName || form.publicKeyFileName.length === 0) {
                return publicKeyDefaultFileName.value;
            }

            return form.publicKeyFileName;
        });

        const privateKey = computed(() => {
            switch (props.variant) {
                case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                    return storeRefs.hePrivateKey.value;
                default:
                    return storeRefs.defaultPrivateKey.value;
            }
        });

        const privateKeyDefaultFileName = computed(() => {
            switch (props.variant) {
                case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                    return 'private-he.key';
                default:
                    return 'private.pem';
            }
        });

        const privateKeyFileName = computed(() => {
            if (!form.privateKeyFileName || form.privateKeyFileName.length === 0) {
                return privateKeyDefaultFileName.value;
            }

            return form.privateKeyFileName;
        });

        form.privateKeyFileName = privateKeyFileName.value;
        form.publicKeyFileName = publicKeyFileName.value;
        form.passphrase = storeRefs.defaultPassphrase.value || '';

        const selectDir = async () => {
            const output = await useIPCRenderer().invoke(IPCChannel.DIR_SELECT);

            if (output.canceled || output.filePaths.length === 0) return;

            switch (props.variant) {
                case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                    store.setHePath(output.filePaths[0]);
                    break;
                default:
                    store.setDefaultPath(output.filePaths[0]);
                    break;
            }
        };

        const generate = async () => {
            if (!directoryPath.value) return;

            let keyPair = {};

            const ipcRenderer = useIPCRenderer();

            try {
                switch (props.variant) {
                    case KeyPairVariant.HOMOMORPHIC_ENCRYPTION: {
                        keyPair = await ipcRenderer.invoke(IPCChannel.CRYPTO_HE_GENERATE);
                        break;
                    }
                    case KeyPairVariant.DEFAULT:
                        keyPair = await ipcRenderer.invoke(IPCChannel.CRYPTO_RSA_GENERATE, form.passphrase);
                        break;
                }
            } catch (e) {
                if (toast) {
                    toast.warning({ body: 'The key pair could not be generated.' }, { pos: 'top-center' });
                }

                return;
            }

            try {
                await ipcRenderer.invoke(IPCChannel.FS_WRITE_FILE, join(directoryPath.value, privateKeyFileName.value), keyPair.privateKey);
                await ipcRenderer.invoke(IPCChannel.FS_WRITE_FILE, join(directoryPath.value, publicKeyFileName.value), keyPair.publicKey);
            } catch (e) {
                if (toast) {
                    toast.warning({ body: 'The key pair could not be written to the specified directory.' }, { pos: 'top-center' });
                }

                return;
            }

            switch (props.variant) {
                case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                    store.setHeKeyPair(keyPair);
                    break;
                case KeyPairVariant.DEFAULT:
                    store.setDefaultPassphrase(form.passphrase);
                    store.setDefaultKeyPair(keyPair);
                    break;
            }

            if (toast) {
                toast.success({ body: 'The key pair was successfully generated.' }, { pos: 'top-center' });
            }
        };

        const load = async () => {
            if (!isDirectoryPathDefined.value) return;

            const privateKeyPath = join(directoryPath.value, privateKeyFileName.value);
            const publicKeyPath = join(directoryPath.value, publicKeyFileName.value);

            const keyPair : {
                privateKey?: string,
                publicKey?: string
            } = {};

            const ipcRenderer = useIPCRenderer();
            keyPair.privateKey = await ipcRenderer.invoke(IPCChannel.FS_READ_FILE, privateKeyPath);
            if (!keyPair.privateKey) {
                if (toast) {
                    toast.warning({ body: 'The private key could not be found or be read.' }, { pos: 'top-center' });
                }

                return;
            }

            keyPair.publicKey = await ipcRenderer.invoke(IPCChannel.FS_READ_FILE, publicKeyPath);
            if (!keyPair.publicKey) {
                if (toast) {
                    toast.warning({ body: 'The public key could not be found or be read.' }, { pos: 'top-center' });
                }

                return;
            }

            switch (props.variant) {
                case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                    store.setHeKeyPair(keyPair);
                    break;
                case KeyPairVariant.DEFAULT: {
                    keyPair.privateKey = await ipcRenderer.invoke(IPCChannel.CRYPTO_RSA_KEY_DECRYPT, keyPair.privateKey, form.passphrase);
                    if (!keyPair.privateKey) {
                        if (toast) {
                            toast.warning({ body: 'The encrypted private key could not be decrypted with the given passphrase.' }, { pos: 'top-center' });
                        }

                        return;
                    }

                    store.setDefaultPassphrase(form.passphrase);

                    keyPair.publicKey = isHex(keyPair.publicKey) ?
                        Buffer.from(keyPair.publicKey, 'hex').toString('utf-8') :
                        keyPair.publicKey;

                    store.setDefaultKeyPair(keyPair);
                    break;
                }
            }

            if (toast) {
                toast.success({ body: 'The key pair was successfully loaded.' }, { pos: 'top-center' });
            }
        };

        return {
            selectDir,
            directoryPath,
            isDirectoryPathDefined,
            isPassphraseRequired,
            isPassphraseDefined,
            form,
            privateKeyDefaultFileName,
            publicKeyDefaultFileName,
            load,
            privateKey,
            publicKey,
            generate,
        };
    },
});
</script>
<template>
    <div>
        <div class="row">
            <div class="col">
                <div>
                    <div
                        class="form-group"
                    >
                        <label>Directory Path</label>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <button
                                    type="submit"
                                    class="btn btn-dark btn-sm"
                                    @click.prevent="selectDir"
                                >
                                    <i class="fa fa-file" />
                                </button>
                            </div>

                            <input
                                v-model="directoryPath"
                                type="text"
                                name="name"
                                class="form-control"
                                :disabled="true"
                                placeholder="..."
                            >
                        </div>

                        <div
                            v-if="!isDirectoryPathDefined"
                            class="form-group-hint group-required"
                        >
                            Select a directory path.
                        </div>
                    </div>
                </div>

                <div
                    v-if="isPassphraseRequired"
                    class="form-group"
                >
                    <label>Passphrase</label>
                    <input
                        v-model="form.passphrase"
                        type="password"
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
            </div>
            <div class="col">
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
            </div>
        </div>

        <div class="d-flex flex-row justify-content-around mb-2">
            <div>
                <button
                    type="submit"
                    class="btn btn-primary btn-sm"
                    :disabled="!isDirectoryPathDefined || (isPassphraseRequired && !isPassphraseDefined)"
                    @click.prevent="load"
                >
                    <i class="fa fa-file-upload" /> Load
                </button>
            </div>
            <div>
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
                    <i class="fa fa-wrench" /> Generate
                </button>
            </div>
        </div>

        <hr>

        <div class="row">
            <div class="col">
                <key-display
                    :key-pair-variant="variant"
                    :key-variant="'public'"
                />
            </div>
        </div>
    </div>
</template>
