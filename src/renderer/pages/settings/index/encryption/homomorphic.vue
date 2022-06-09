<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { KeyPairVariant } from '../../../../domains/encryption/type';
import { CreateElement, VNode } from 'vue';
import KeyPairPicker from '../../../../components/key/KeyPairPicker.vue';

export default {
    components: {
        KeyPairPicker,
    },
    render(h: CreateElement): VNode {
        return h('div', [
            h(KeyPairPicker, {
                props: {
                    variant: KeyPairVariant.HOMOMORPHIC_ENCRYPTION
                }
            })
        ])
    }
};
</script>
