<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script>
import AlertMessage from "../../components/alert/AlertMessage";
import * as paillierBigint from 'paillier-bigint'

export default {
    components: {AlertMessage},
    data() {
        return {
            message: null,
            number: '',

            result: ''
        }
    },
    computed: {
        privateKey() {
            const key = this.$store.getters['secret/hePrivateKey'];
            if(!key) return key;

            BigInt.prototype.toJSON = function() { return this.toString()  }

            const data = JSON.parse(key);

            return new paillierBigint.PrivateKey(BigInt(data.lambda), BigInt(data.mu), this.publicKey);
        },
        publicKey() {
            const key = this.$store.getters['secret/hePublicKey'];

            if(!key) return key;

            BigInt.prototype.toJSON = function() { return this.toString()  }

            const data = JSON.parse(key);

            return new paillierBigint.PublicKey(BigInt(data.n), BigInt(data.g));
        }
    },
    methods: {
        async decrypt() {
            if(!this.privateKey) return;

            try {
                this.result = this.privateKey.decrypt(BigInt(this.number));

                this.message = {
                    isError: false,
                    data: 'The paillier number was successfully decrypted.'
                }
            } catch (e) {
                this.message = {
                    data: e.message,
                    isError: true
                }
            }
        }
    }
}
</script>
<template>
    <div>
        <h1 class="title mb-2">
            <i class="fa fa-key"></i> Paillier Number
        </h1>

        <alert-message :message="message" />

        <div class="alert alert-danger alert-sm" v-if="!privateKey">
            You first have to load your private and public key or generate them...<br />
            <nuxt-link
                type="button"
                class="btn btn-dark btn-xs"
                :to="'/settings'"
            >
                <i class="fa fa-cog"></i> Settings
            </nuxt-link>
        </div>

        <hr />

        <div class="form-group">
            <label>Input</label>
            <input type="text" class="form-control" v-model="number"  placeholder="..." />
        </div>

        <button
            :disabled="!privateKey"
            type="submit"
            class="btn btn-dark btn-sm"
            @click.prevent="decrypt">
            <i class="fa fa-file-code"></i> Decrypt
        </button>

        <hr />

        <div class="form-group">
            <label>Output</label>
            <textarea rows="4" class="form-control" :value="result" :disabled="true" placeholder="{...}" />
        </div>
    </div>
</template>
