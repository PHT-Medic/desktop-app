<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<template>
    <div>
        <div class="alert alert-danger alert-sm" v-if="!privateKey">
            You first have to load your private and public key or generate them...
        </div>

        <alert-message :message="message" />

        <div>
            <div class="form-group">
                <label>Passphrase</label>
                <input type="text" class="form-control" v-model="passphrase"  placeholder="..." />
            </div>

            <div class="form-group">
                <label>Hash</label>
                <textarea class="form-control" v-model="hash" rows="6" placeholder="..."></textarea>
            </div>

            <button :disabled="!privateKey" type="submit" class="btn btn-dark btn-sm"  @click.prevent="sign">
                <i class="fa fa-sign"></i> Sign
            </button>

            <hr />

            <div class="form-group">
                <label>Signature (readonly)</label>
                <textarea class="form-control" v-model="signature" rows="6" placeholder="..." :disabled="true"></textarea>
            </div>
        </div>
    </div>
</template>
<script>
import {createSign, generateKeyPairSync} from 'crypto';
import AlertMessage from "../../components/alert/AlertMessage";

export default {
    components: {AlertMessage},
    data() {
        return {
            hash: '',
            passphrase: '',
            signature: '',

            message: null,
        }
    },
    methods: {
        async sign() {
            if(!this.isHashValid || !this.privateKey) return;

            try {
                const sign = createSign('SHA512');
                sign.update(this.hash);

                const signature = sign.sign({
                    key: this.privateKey,
                    passphrase: this.passphrase
                });

                this.signature = signature.toString('hex');

                this.message = {
                    isError: false,
                    data: 'The signature was successfully generated.'
                }
            } catch (e) {
                this.message = {
                    isError: true,
                    data: 'The passphrase was not valid.'
                }
            }
        }
    },
    computed: {
        isHashValid() {
            return !!this.hash && this.hash.length !== 0;
        },
        privateKey() {
            return this.$store.getters['secret/defaultPrivateKey'];
        }
    }
}
</script>
