<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script>
import { ipcRenderer } from 'electron';
import { signHash } from '../../domains/signature/sign';
import AlertMessage from '../../components/alert/AlertMessage';
import { LayoutKey, LayoutNavigationID } from '../../config/layout';

export default {
    meta: {
        [LayoutKey.NAVIGATION_ID]: LayoutNavigationID.DEFAULT,
    },
    components: { AlertMessage },
    data() {
        return {
            form: {
                hash: '',
                signature: '',
            },

            message: null,
        };
    },
    computed: {
        isHashValid() {
            return !!this.form.hash && this.form.hash.length !== 0;
        },
        privateKey() {
            return this.$store.getters['secret/defaultPrivateKey'];
        },
    },
    methods: {
        async sign() {
            if (!this.isHashValid || !this.privateKey) return;

            try {
                this.form.signature = signHash(this.form.hash, this.privateKey);

                this.message = {
                    isError: false,
                    data: 'The signature was successfully generated.',
                };

                this.copyToClipboard();
            } catch (e) {
                this.message = {
                    isError: true,
                    // todo more detailed error messages
                    data: 'The passphrase is not valid.',
                };
            }
        },
        copyToClipboard() {
            let text = this.form.signature;

            if (!text) {
                this.$bvToast.toast('No signature to copy.', {
                    variant: 'danger',
                    toaster: 'b-toaster-top-center',
                });

                return;
            }

            text = text.toString();

            if (text.length === 0) {
                this.$bvToast.toast('The signature to copy is empty.', {
                    variant: 'warning',
                    toaster: 'b-toaster-top-center',
                });

                return;
            }

            ipcRenderer.send('copy-to-clipboard', text);

            this.$bvToast.toast('Successfully copied signature to clipboard', {
                variant: 'success',
                toaster: 'b-toaster-top-center',
            });
        },
    },
};
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
