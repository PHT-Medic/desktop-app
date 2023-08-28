<!--
  Copyright (c) 2021-2021.
  Author Peter Placzek (tada5hi)
  For the full copyright and license information,
  view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { useToast } from 'bootstrap-vue-next';
import { join } from 'pathe';
import {
    computed, defineComponent, ref, toRef,
} from 'vue';
import { IPCChannel, useIPCRenderer } from '../core/electron';

export default defineComponent({
    props: {
        items: {
            type: Array,
            default: () => [],
        },
        destinationPath: {
            type: String,
            default: '',
        },
    },
    emits: ['deleted', 'saved'],
    setup(props, { emit }) {
        const itemsRef = toRef(props, 'items');
        const destinationPathRef = toRef(props, 'destinationPath');
        const busy = ref(false);

        const toast = useToast();

        const isDestinationPathDefined = computed(() => typeof destinationPathRef.value !== 'undefined' &&
              destinationPathRef.value.length !== 0);

        const ipcRenderer = useIPCRenderer();
        const selectDir = async () => {
            const output = await ipcRenderer.invoke(IPCChannel.DIR_SELECT);

            if (output.canceled || output.filePaths.length === 0) return;

            [destinationPathRef.value] = output.filePaths;
        };

        const drop = (item) => {
            const index = itemsRef.value.findIndex((el) => el.path === item.path);
            if (index !== -1) {
                itemsRef.value.splice(index, 1);
                emit('deleted', item);
            }
        };
        const save = async () => {
            if (busy.value) return;

            busy.value = true;

            try {
                const savePromises = [];

                await ipcRenderer.invoke(IPCChannel.FS_MKDIR, destinationPathRef.value);

                for (let i = 0; i < itemsRef.value.length; i++) {
                    const filePath = join(
                        destinationPathRef.value,
                        itemsRef.value[i].path,
                    );

                    const directoryPath = join(filePath, '..');

                    savePromises.push(ipcRenderer.invoke(IPCChannel.FS_MKDIR, directoryPath));
                    savePromises.push(ipcRenderer.invoke(
                        IPCChannel.FS_WRITE_FILE,
                        filePath,
                        itemsRef.value[i].content,
                    ));
                }

                await Promise.all(savePromises);

                emit('saved');

                if (toast) {
                    toast.success({ body: 'The files were successfully saved.' }, { pos: 'top-center' });
                }

                ipcRenderer.send(IPCChannel.DIR_OPEN, destinationPathRef.value);
            } catch (e) {
                emit('failed');

                if (toast) {
                    toast.success({ body: 'The files could not be saved.' }, { pos: 'top-center' });
                }
            }

            busy.value = false;
        };

        return {
            isDestinationPathDefined,
            selectDir,
            destinationPathRef,
            itemsRef,
            save,
            drop,
        };
    },
});
</script>
<template>
    <div>
        <div
            class="form-group"
            :class="{ 'form-group-error': !isDestinationPathDefined }"
        >
            <label>Directory Path</label>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <button
                        type="submit"
                        class="btn btn-dark btn-sm"
                        @click.prevent="selectDir"
                    >
                        <i class="fa fa-file" />
                    </button>
                </div>

                <input
                    v-model="destinationPathRef"
                    type="text"
                    name="name"
                    class="form-control"
                    :disabled="true"
                    placeholder="..."
                >
            </div>

            <div
                v-if="!isDestinationPathDefined"
                class="form-group-hint group-required"
            >
                Select a directory path.
            </div>
        </div>

        <div class="mb-2">
            <template
                v-for="(item, key) in itemsRef"
                :key="key"
            >
                <div

                    class="card card-file d-flex flex-row align-items-center"
                >
                    <div class="card-heading">
                        <i
                            class="fa fa-file"
                            style="font-size: 1.25rem"
                        />
                    </div>
                    <div class="card-body">
                        <span class="title">
                            {{ item.path }}
                            <small class="text-muted">{{ item.content.length * 2 }} Bytes</small>
                        </span>
                    </div>
                    <div class="ms-auto">
                        <button
                            type="button"
                            class="btn-xs btn btn-dark"
                            href="javascript:void(0)"
                            style="margin-right: .75rem"
                            @click.prevent="drop(item)"
                        >
                            <i class="fa fa-times" />
                        </button>
                    </div>
                </div>
            </template>
            <div
                v-if="items.length === 0"
                class="alert alert-warning alert-sm"
            >
                There are no files selected to save...
            </div>
        </div>

        <button
            :disabled="items.length === 0 || !isDestinationPathDefined"
            type="button"
            class="btn btn-xs btn-dark"
            @click.prevent="save"
        >
            <i class="fas fa-download" /> Save
        </button>
    </div>
</template>
