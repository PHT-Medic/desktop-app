<!--
  Copyright (c) 2021-2021.
  Author Peter Placzek (tada5hi)
  For the full copyright and license information,
  view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { useToast } from 'bootstrap-vue-next';
import { join } from 'pathe';
import type { PropType } from 'vue';
import {
    defineComponent, ref, toRef,
} from 'vue';
import type { TarFile } from '../../core';
import { IPCChannel, useIPCRenderer } from '../core/electron';

export default defineComponent({
    props: {
        items: {
            type: Array as PropType<TarFile[]>,
            default: () => [],
        },
        id: {
            type: String,
        },
        displayButton: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['saved', 'failed'],
    setup(props, { emit, expose }) {
        const ipcRenderer = useIPCRenderer();
        const toast = useToast();

        const itemsRef = toRef(props, 'items');

        const destinationPath = ref<string | null>(null);
        const busy = ref(false);

        const selected = (input: string) => {
            destinationPath.value = input;
        };

        const drop = (item: TarFile) => {
            const index = itemsRef.value.findIndex((el) => el.path === item.path);
            if (index !== -1) {
                itemsRef.value.splice(index, 1);
            }
        };
        const save = async () => {
            if (busy.value || !destinationPath.value || itemsRef.value.length === 0) return;

            busy.value = true;

            let directoryPath : string;
            if (props.id) {
                directoryPath = join(destinationPath.value, props.id);
            } else {
                directoryPath = destinationPath.value;
            }

            try {
                const savePromises = [];

                await ipcRenderer.invoke(IPCChannel.FS_MKDIR, directoryPath);

                for (let i = 0; i < itemsRef.value.length; i++) {
                    const filePath = join(
                        directoryPath,
                        itemsRef.value[i].path,
                    );

                    const fileDirectoryPath = join(filePath, '..');

                    savePromises.push(ipcRenderer.invoke(IPCChannel.FS_MKDIR, fileDirectoryPath));
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

                ipcRenderer.send(IPCChannel.DIR_OPEN, destinationPath.value);
            } catch (e) {
                emit('failed');

                if (toast) {
                    toast.success({ body: 'The files could not be saved.' }, { pos: 'top-center' });
                }
            }

            busy.value = false;
        };

        expose({
            save,
        });

        return {
            selected,
            destinationPath,
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
            :class="{ 'form-group-error': !destinationPath }"
        >
            <label>Directory Path</label>
            <DirectoryPicker @selected="selected" />

            <div
                v-if="!destinationPath"
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
            v-if="displayButton"
            :disabled="items.length === 0 || !destinationPath"
            type="button"
            class="btn btn-sm btn-block btn-primary"
            @click.prevent="save"
        >
            <i class="fas fa-download" /> Save
        </button>
    </div>
</template>
