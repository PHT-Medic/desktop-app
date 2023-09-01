<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script>
import { storeToRefs } from 'pinia';
import { useSecretStore } from '~/store/secret';
import { definePageMeta } from '#imports';
import { LayoutKey, LayoutNavigationID } from '~/config/layout';

export default {
    setup() {
        definePageMeta({
            [LayoutKey.NAVIGATION_ID]: LayoutNavigationID.DEFAULT,
        });

        const store = useSecretStore();
        const { rsaPrivateKey, hePrivateKey } = storeToRefs(store);

        return {
            defaultPrivateKey: rsaPrivateKey,
            hePrivateKey,
        };
    },
};
</script>
<template>
    <div>
        <h6>
            <i class="fa fa-file" /> Keys
        </h6>

        <div class="row">
            <div class="col">
                <div
                    class="alert alert-sm"
                    :class="{'alert-warning': !defaultPrivateKey, 'alert-success': defaultPrivateKey}"
                >
                    <strong>RSA</strong>

                    <p>
                        To <strong>sign</strong> a string or <strong>decrypt</strong>
                        selected / downloaded compressed result files, provide or generate a RSA key-pair.
                    </p>

                    <div class="d-flex flex-row justify-content-around">
                        <div>
                            <NuxtLink
                                class="btn btn-xs btn-dark"
                                :to="'/settings/encryption'"
                            >
                                <i class="fa fa-key" /> KeyPair
                            </NuxtLink>
                        </div>
                        <div
                            v-if="defaultPrivateKey"
                        >
                            <NuxtLink

                                class="btn btn-xs btn-dark"
                                :to="'/sign'"
                            >
                                <i class="fas fa-file-alt" /> Signature
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div
                    class="alert alert-sm"
                    :class="{'alert-warning': !hePrivateKey, 'alert-success': hePrivateKey}"
                >
                    <strong>Homomorphic</strong>

                    <p>
                        To <strong>decrypt</strong> (nested) object property values of decrypted result files, which are encrypted with
                        the homomorphic encryption, provide or generate a key-pair.
                    </p>

                    <div class="d-flex flex-row justify-content-around">
                        <div>
                            <NuxtLink
                                class="btn btn-xs btn-dark"
                                :to="'/settings/encryption/homomorphic'"
                            >
                                <i class="fa fa-key" /> KeyPair
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
