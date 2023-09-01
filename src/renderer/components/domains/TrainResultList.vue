<!--
  - Copyright (c) 2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import type { Train } from '@personalhealthtrain/core';
import { TrainResultStatus } from '@personalhealthtrain/core';
import { storeToRefs } from 'pinia';
import type { BuildInput } from 'rapiq';
import { computed, ref } from 'vue';
import {
    ListPagination,
    ListSearch, ListTitle, TrainList, TrainName, injectAPIClient,
} from '@personalhealthtrain/client-vue';
import { defineNuxtComponent } from '#app';
import { useAuthStore } from '../../store/auth';

export default defineNuxtComponent({
    components: {
        TrainName,
        ListPagination,
        ListSearch,
        ListTitle,
        TrainList,
    },
    setup(props, { emit, expose }) {
        const apiClient = injectAPIClient();

        const store = useAuthStore();
        const { realmId } = storeToRefs(store);

        const query = computed<BuildInput<Train>>(() => ({
            filter: {
                realm_id: realmId.value,
                result_status: TrainResultStatus.FINISHED,
            },
        }));

        const selected = ref(null);

        const select = async (id: string | null) => {
            if (selected.value !== id) {
                selected.value = id;
                emit('selected', apiClient.train.getResultDownloadURL(id));
            } else {
                selected.value = null;
                emit('selected', null);
            }
        };

        const reset = () => {
            selected.value = null;
        };

        expose({
            reset,
        });

        return {
            select,
            selected,
            query,
        };
    },
});
</script>
<template>
    <TrainList :query="query">
        <template #header="props">
            <ListSearch
                :load="props.load"
                :meta="props.meta"
            />
        </template>
        <template #body="props">
            <ul class="list-unstyled">
                <li
                    v-for="entity in props.data"
                    :key="entity.id"
                    class="d-flex flex-row p-2 mb-1"
                >
                    <TrainName
                        :entity-id="entity.id"
                        :entity-name="entity.name"
                    />

                    <div class="ms-auto">
                        <button
                            type="button"
                            class="btn btn-xs"
                            :class="{'btn-primary': selected !== entity.id, 'btn-dark': selected === entity.id}"
                            @click="select(entity.id)"
                        >
                            <template v-if="selected === entity.id">
                                <i class="fa fa-times" />
                            </template>
                            <template v-else>
                                <i class="fa fa-check" />
                            </template>
                        </button>
                    </div>
                </li>
            </ul>
        </template>
        <template #footer="props">
            <ListPagination
                :load="props.load"
                :meta="props.meta"
            />
        </template>
    </TrainList>
</template>
