<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script>
import { ipcRenderer } from 'electron';
import { KeyPairVariant, KeyVariant } from '../../modules/encryption/type';

export default {
    props: {
        keyPairVariant: String,
        keyVariant: String,
    },
    computed: {
        contentRaw() {
            switch (this.keyVariant) {
                case KeyVariant.PRIVATE:
                    switch (this.keyPairVariant) {
                        case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                            return this.$store.getters['secret/hePrivateKey'] ?
                                JSON.stringify(this.$store.getters['secret/hePrivateKey']) :
                                undefined;
                        case KeyPairVariant.DEFAULT:
                            return this.$store.getters['secret/defaultPrivateKey'];
                    }
                    break;
                case KeyVariant.PUBLIC:
                    switch (this.keyPairVariant) {
                        case KeyPairVariant.HOMOMORPHIC_ENCRYPTION:
                            return this.$store.getters['secret/hePublicKey'] ?
                                JSON.stringify(this.$store.getters['secret/hePublicKey']) :
                                undefined;
                        case KeyPairVariant.DEFAULT:
                            return this.$store.getters['secret/defaultPublicKey'];
                    }
                    break;
            }

            return undefined;
        },
        content() {
            let content = this.contentRaw;

            if (!content) return undefined;

            if (Buffer.isBuffer(content)) {
                content = content.toString();
            }

            if (ArrayBuffer.isView(content)) {
                content = content.toString();
            }

            if (typeof content === 'number') {
                content = content.toString();
            }

            return Buffer.from(content, 'utf-8')
                .toString('hex');
        },

        label() {
            switch (this.keyVariant) {
                case KeyVariant.PRIVATE:
                    return 'PrivateKey';
                case KeyVariant.PUBLIC:
                    return 'PublicKey';
            }

            return 'Key';
        },
    },
    methods: {
        copyToClipboard() {
            let text = this.content;

            if (!text) {
                this.$bvToast.toast('There does not exist a valid key to copy.', {
                    variant: 'danger',
                    toaster: 'b-toaster-top-center',
                });

                return;
            }

            text = text.toString();

            if (text.length === 0) {
                this.$bvToast.toast('The key to copy is empty.', {
                    variant: 'warning',
                    toaster: 'b-toaster-top-center',
                });

                return;
            }

            ipcRenderer.send('copy-to-clipboard', text);

            this.$bvToast.toast('Successfully copied key to clipboard', {
                variant: 'success',
                toaster: 'b-toaster-top-center',
            });
        },
    },
};
</script>
<template>
    <div>
        <div class="form-group">
            <label class="d-flex flex-row">{{ label }} <a
                v-if="content"
                href="javascript:void(0)"
                class="badge badge-dark ml-auto"
                @click.prevent="copyToClipboard()"
            ><i class="fa fa-copy" /> Copy</a></label>
            <textarea
                v-model="content"
                :disabled="true"
                class="form-control"
                rows="8"
                placeholder="..."
            />
        </div>
    </div>
</template>
