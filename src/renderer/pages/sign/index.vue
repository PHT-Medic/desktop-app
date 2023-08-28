<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { useToast } from 'bootstrap-vue-next';
import { defineComponent, reactive, ref } from 'vue';
import { IPCChannel, useIPCRenderer } from '../../core/electron';
import AlertMessage from '../../components/alert/AlertMessage';
import { LayoutKey, LayoutNavigationID } from '../../config/layout';
import { definePageMeta } from '#imports';
import { useSecretStore } from '~/store/secret';

export default defineComponent({
    components: { AlertMessage },
    setup() {
        definePageMeta({
            [LayoutKey.NAVIGATION_ID]: LayoutNavigationID.DEFAULT,
        });

        const toast = useToast();
        const store = useSecretStore();

        const form = reactive({
            hash: '',
            signature: '',
        });

        const message = ref(null);

        const copyToClipboard = () => {
            let text = form.signature;

            if (!text) {
                if (toast) {
                    toast.danger({ body: 'No signature to copy' }, { pos: 'top-center' });
                }

                return;
            }

            text = text.toString();

            if (text.length === 0) {
                if (toast) {
                    toast.warning({ body: 'No signature to copy is empty' }, { pos: 'top-center' });
                }

                return;
            }

            useIPCRenderer()
                .send(IPCChannel.COPY_TO_CLIPBOARD, text);

            if (toast) {
                toast.success({ body: 'Successfully copied signature to clipboard' }, { pos: 'top-center' });
            }
        };

        const sign = async () => {
            if (!form.hash || !store.defaultPrivateKey) return;

            try {
                form.signature = await useIPCRenderer()
                    .invoke(IPCChannel.CRYPTO_SIGN, form.hash, store.defaultPrivateKey);
                if (toast) {
                    toast.success({ body: 'The signature was successfully generated.' }, { pos: 'top-center' });
                }

                copyToClipboard();
            } catch (e) {
                if (toast) {
                    toast.danger({ body: 'The passphrase is not valid' }, { pos: 'top-center' });
                }
            }
        };

        return {
            privateKey: store.defaultPrivateKey,
            message,
            form,
            sign,
            copyToClipboard,
        };
    },
});
</script>
<template>
    <div>
        <h1 class="title no-border mb-2">
            <i class="fas fa-file-signature" /> Train Signature
        </h1>
        <p>
            <i class="fas fa-info-circle" />
            <span>
                Sign the hash of the train content with your private key here
            </span>
        </p>
        <div
            v-if="!privateKey"
            class="alert alert-danger alert-sm"
        >
            You first have to load your private and public key or generate them...<br>
            <nuxt-link
                type="button"
                class="btn btn-dark btn-xs"
                :to="'/settings/encryption'"
            >
                <i class="fa fa-cog" /> Settings
            </nuxt-link>
        </div>

        <alert-message :message="message" />

        <hr>

        <div>
            <div class="form-group">
                <label>Hash</label>
                <textarea
                    v-model="form.hash"
                    class="form-control"
                    rows="6"
                    placeholder="..."
                />
            </div>

            <button
                :disabled="!privateKey"
                type="submit"
                class="btn btn-dark btn-sm"
                @click.prevent="sign"
            >
                <i class="fa fa-marker" /> Sign
            </button>

            <hr>

            <div class="form-group">
                <label>Signature (readonly)</label>
                <label class="d-flex flex-row"><a
                    v-if="form.signature"
                    href="javascript:void(0)"
                    class="badge badge-dark ml-auto"
                    @click.prevent="copyToClipboard()"
                ><i class="fa fa-copy" /> Copy</a></label>
                <textarea
                    v-model="form.signature"
                    class="form-control"
                    rows="6"
                    placeholder="..."
                    :disabled="true"
                />
            </div>
        </div>
    </div>
</template>
