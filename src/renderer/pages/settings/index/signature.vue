<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<template>
    <div>
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
                <label>Content</label>
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
<script>
import { createSign, constants } from 'crypto';
import { maxLength, minLength, required } from 'vuelidate/lib/validators';
import AlertMessage from '../../../components/alert/AlertMessage';
import { LayoutKey, LayoutNavigationID } from '../../../config/layout/contants';

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
                const sign = createSign('SHA512');
                sign.update(this.form.hash);

                const signature = sign.sign({
                    key: this.privateKey,
                    padding: constants.RSA_PKCS1_PSS_PADDING,
                    mgf1HashAlgorithm: 'SHA512',
                    saltLength: constants.RSA_PSS_SALTLEN_DIGEST,
                });

                this.form.signature = signature.toString('hex');

                this.message = {
                    isError: false,
                    data: 'The signature was successfully generated.',
                };
            } catch (e) {
                console.log(e);
                this.message = {
                    isError: true,
                    data: 'The passphrase is not valid.',
                };
            }
        },
    },
};
</script>
