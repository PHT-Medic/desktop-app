<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<template>
    <div>
        <h1 class="title no-border mb-2">
            <i class="fas fa-file-alt" /> Hash
        </h1>

        <div
            v-if="!privateKey"
            class="alert alert-danger alert-sm"
        >
            You first have to load your private and public key or generate them...<br>
            <nuxt-link
                type="button"
                class="btn btn-dark btn-xs"
                :to="'/settings'"
            >
                <i class="fa fa-cog" /> Settings
            </nuxt-link>
        </div>

        <alert-message :message="message" />

        <hr>

        <div>
            <div
                class="form-group"
                :class="{ 'form-group-error': $v.form.passphrase.$error }"
            >
                <label>Passphrase</label>
                <input
                    v-model="$v.form.passphrase.$model"
                    type="text"
                    name="name"
                    class="form-control"
                    placeholder="..."
                >

                <div
                    v-if="!$v.form.passphrase.required && !$v.form.passphrase.$model"
                    class="form-group-hint group-required"
                >
                    Please enter a passphrase.
                </div>
                <div
                    v-if="!$v.form.passphrase.minLength"
                    class="form-group-hint group-required"
                >
                    The length of the passphrase must be less than <strong>{{ $v.form.passphrase.$params.minLength.min }}</strong> characters.
                </div>
                <div
                    v-if="!$v.form.passphrase.maxLength"
                    class="form-group-hint group-required"
                >
                    The length of the passphrase must be greater than <strong>{{ $v.form.passphrase.$params.maxLength.max }}</strong> characters.
                </div>
            </div>

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
                :disabled="!privateKey || $v.form.$invalid"
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
import { createSign } from 'crypto';
import { maxLength, minLength, required } from 'vuelidate/lib/validators';
import AlertMessage from '../../components/alert/AlertMessage';
import { LayoutKey, LayoutNavigationID } from '../../config/layout/contants';

export default {
    meta: {
        [LayoutKey.NAVIGATION_ID]: LayoutNavigationID.DEFAULT,
    },
    components: { AlertMessage },
    data() {
        return {
            form: {
                hash: '',
                passphrase: '',
                signature: '',
            },

            message: null,
        };
    },
    validations: {
        form: {
            passphrase: {
                required,
                minLength: minLength(3),
                maxLength: maxLength(256),
            },
        },
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
                    passphrase: this.form.passphrase,
                });

                this.form.signature = signature.toString('hex');

                this.message = {
                    isError: false,
                    data: 'The signature was successfully generated.',
                };
            } catch (e) {
                this.message = {
                    isError: true,
                    data: 'The passphrase is not valid.',
                };
            }
        },
    },
};
</script>
