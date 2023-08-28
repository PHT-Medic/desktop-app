<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { useToast } from 'bootstrap-vue-next';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { KeyPairVariant } from '../../../main/core/crypto/type';
import { IPCChannel, useIPCRenderer } from '../../core/electron';
import { useSecretStore } from '~/store/secret';

function toHex(str: string) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += str.charCodeAt(i).toString(16);
    }
    return result;
}

export default defineComponent({
    props: {
        keyPairVariant: String,
        keyVariant: String as PropType<'private' | 'public'>,
    },
    setup(props) {
        const toast = useToast();
        const store = useSecretStore();
        const storeRefs = storeToRefs(store);

        const contentRaw = computed<string | number | Buffer | undefined>(() => {
            switch (props.keyVariant) {
                case 'private':
                    switch (props.keyPairVariant) {
                        case KeyPairVariant.HOMOMORPHIC_ENCRYPTION: {
                            if (storeRefs.hePrivateKey.value) {
                                return JSON.stringify(storeRefs.hePrivateKey.value);
                            }

                            return undefined;
                        }
                        case KeyPairVariant.DEFAULT: {
                            return storeRefs.defaultPrivateKey.value;
                        }
                    }
                    break;
                case 'public':
                    switch (props.keyPairVariant) {
                        case KeyPairVariant.HOMOMORPHIC_ENCRYPTION: {
                            if (storeRefs.hePublicKey.value) {
                                return JSON.stringify(storeRefs.hePublicKey.value);
                            }

                            return undefined;
                        }
                        case KeyPairVariant.DEFAULT: {
                            return storeRefs.defaultPublicKey.value;
                        }
                    }
                    break;
            }

            return undefined;
        });

        const content = computed(() => {
            if (!contentRaw.value) {
                return undefined;
            }

            let content = contentRaw.value;

            if (ArrayBuffer.isView(content)) {
                content = content.toString();
            }

            if (typeof content === 'number') {
                content = content.toString();
            }

            return toHex(content);
        });

        const label = computed(() => {
            switch (props.keyVariant) {
                case 'private':
                    return 'PrivateKey';
                case 'public':
                    return 'PublicKey';
            }

            return 'Key';
        });

        const copyToClipboard = () => {
            let text = content.value;

            if (!text) {
                if (toast) {
                    toast.danger({ body: 'There does not exist a valid key to copy.' }, { pos: 'top-center#' });
                }

                return;
            }

            text = text.toString();

            if (text.length === 0) {
                if (toast) {
                    toast.warning({ body: 'The key to copy is empty.' }, { pos: 'top-center' });
                }
                return;
            }

            useIPCRenderer().send(IPCChannel.COPY_TO_CLIPBOARD, text);

            if (toast) {
                toast.success({ body: 'Successfully copied key to clipboard' }, { pos: 'top-center' });
            }
        };

        return {
            content,
            label,
            copyToClipboard,
        };
    },
});
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
