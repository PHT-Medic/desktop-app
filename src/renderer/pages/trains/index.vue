<!--
  - Copyright (c) 2023-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import type { Train } from '@personalhealthtrain/core';
import { PermissionID, TrainResultStatus } from '@personalhealthtrain/core';
import { storeToRefs } from 'pinia';
import type { BuildInput } from 'rapiq';
import { computed, ref } from 'vue';
import {
    ListPagination,
    ListSearch, ListTitle, TrainList, TrainName, TrainResultCommand, injectAPIClient,
} from '@personalhealthtrain/client-vue';
import { definePageMeta } from '#imports';
import { defineNuxtComponent } from '#app';
import TrainResultInspector from '../../components/domains/TrainResultWizardMeta.vue';
import { LayoutKey, LayoutNavigationID } from '../../config/layout';
import { useAuthStore } from '../../store/auth';

export default defineNuxtComponent({
    components: {
        TrainName,
        TrainResultInspector,
        TrainResultCommand,
        ListPagination,
        ListSearch,
        ListTitle,
        TrainList,
    },
    setup() {
        definePageMeta({
            [LayoutKey.REQUIRED_LOGGED_IN]: true,
            [LayoutKey.NAVIGATION_ID]: LayoutNavigationID.DEFAULT,
            [LayoutKey.REQUIRED_PERMISSIONS]: [
                PermissionID.TRAIN_ADD,
                PermissionID.TRAIN_EDIT,
                PermissionID.TRAIN_DROP,

                PermissionID.TRAIN_RESULT_READ,

                PermissionID.TRAIN_EXECUTION_START,
                PermissionID.TRAIN_EXECUTION_STOP,
            ],
        });

        const apiClient = injectAPIClient();

        const store = useAuthStore();
        const { realmId } = storeToRefs(store);

        const query = computed<BuildInput<Train>>(() => ({
            filter: {
                realm_id: realmId.value,
                result_status: TrainResultStatus.FINISHED,
            },
        }));

        const content = ref<string | undefined>(undefined);

        const read = async (entity: Train) => {
            content.value = apiClient.train.getResultDownloadURL(entity.id);

            modalNode.value = true;
        };

        const modalNode = ref(false);
        const hide = () => {
            modalNode.value = false;
        };

        return {
            content,
            read,
            query,
            modalNode,
            hide,
        };
    },
});
</script>
<template>
    <div>
        <div class="alert alert-primary alert-sm">
            This is an overview of all created trains, either by you or a person of your station.
        </div>

        <div class="m-t-10" />

        <BModal
            v-model="modalNode"
            size="lg"
            button-size="sm"
            :no-close-on-backdrop="true"
            :no-close-on-esc="true"
            :hide-footer="true"
        >
            <template #title>
                <i class="fa fa-search" /> Inspector
            </template>
            <TrainResultInspector
                :source="content"
                :source-option="'url'"
                @finished="hide"
            />
        </BModal>
    </div>
</template>
