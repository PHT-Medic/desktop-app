<!--
  - Copyright (c) 2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useLoggedIn } from '../../composables/logged-in';
import FilePicker from '../FilePicker.vue';
import TrainResultList from './TrainResultList.vue';

export default defineComponent({
    components: { FilePicker, TrainResultList },
    emits: ['selected'],
    setup(props, { emit }) {
        const busy = ref(false);
        const types = [
            { id: 'file', name: 'File System' },
            { id: 'remote', name: 'Remote API' },
        ];
        const type = ref('file');

        const filePickerNode = ref<null | typeof FilePicker>(null);
        const listPickerNode = ref<null | typeof TrainResultList>(null);

        const select = (input: string) => {
            emit('selected', input);
        };

        watch(type, (val, oldValue) => {
            if (val !== oldValue) {
                emit('selected', null);
            }

            if (val === 'file' && listPickerNode.value) {
                listPickerNode.value.reset();
            }

            if (val === 'remote' && filePickerNode.value) {
                filePickerNode.value.reset();
            }
        });

        const loggedIn = useLoggedIn();

        return {
            busy,
            loggedIn,
            select,
            types,
            type,
            filePickerNode,
            listPickerNode,
        };
    },
});
</script>

<template>
    <div>
        <div class="alert alert-info alert-sm">
            Pick the result file from the <strong>file system</strong> or <strong>remote api</strong>.
        </div>

        <div class="form-group">
            <label>Source</label>

            <select
                v-model="type"
                class="form-control"
            >
                <option
                    v-for="type in types"
                    :key="type.id"
                    :value="type.id"
                >
                    {{ type.name }}
                </option>
            </select>
        </div>

        <template v-if="type === 'file'">
            <h6 class="text-opacity-50 text-dark">
                File
            </h6>
            <FilePicker
                ref="filePickerNode"
                @selected="select"
            />
        </template>
        <template v-else>
            <template v-if="loggedIn">
                <TrainResultList
                    ref="listPickerNode"
                    @selected="select"
                />
            </template>
            <template v-else>
                <div class="alert alert-sm alert-warning">
                    You need to be logged in to pick a train from the remote api.
                </div>
            </template>
        </template>
    </div>
</template>
