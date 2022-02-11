<!--
  Copyright (c) 2021-2021.
  Author Peter Placzek (tada5hi)
  For the full copyright and license information,
  view the LICENSE file that was distributed with this source code.
  -->
<script>
import * as fs from 'fs';
import path from 'path';
import { ipcRenderer } from 'electron';
import { KeyPairVariant } from '../domains/encryption/type';

export default {
    props: {
        itemsProperty: {
            type: Array,
            default: () => [],
        },
        destinationPathProperty: undefined,
    },
    data() {
        return {
            dirListener: null,

            items: [],

            destinationPath: '',
            busy: false,
        };
    },
    computed: {
        isDestinationPathDefined() {
            return typeof this.destinationPath !== 'undefined' &&
                this.destinationPath.length !== 0;
        },
    },
    created() {
        this.dirListener = (event, arg) => {
            if (arg.canceled || arg.filePaths.length === 0) return;

            // eslint-disable-next-line prefer-destructuring
            this.destinationPath = arg.filePaths[0];
        };

        ipcRenderer.on('dir-selected', this.dirListener);
        this.init();
    },
    beforeDestroy() {
        ipcRenderer.removeListener('dir-selected', this.dirListener);
    },
    methods: {
        init() {
            this.items = this.itemsProperty;
            if (this.destinationPathProperty) {
                this.destinationPath = this.destinationPathProperty;
            } else {
                this.destinationPath = '';
            }
        },
        drop(item) {
            const index = this.items.findIndex((el) => el.path === item.path);
            if (index !== -1) {
                this.items.splice(index, 1);
                this.$emit('deleted', this.item);
            }
        },

        selectDir() {
            ipcRenderer.send('dir-select');
        },

        async createFilePathDirectories(filePath) {
            const directoryPath = path.join(filePath, '..');

            try {
                await fs.promises.access(directoryPath);
            } catch (e) {
                await fs.promises.mkdir(directoryPath, { recursive: true });
            }
        },

        async save() {
            if (this.busy) return;

            this.busy = true;

            try {
                const savePromises = [];

                try {
                    await fs.promises.access(this.destinationPath);
                } catch (e) {
                    await fs.promises.mkdir(this.destinationPath);
                }

                for (let i = 0; i < this.items.length; i++) {
                    const filePath = path.join(
                        this.destinationPath,
                        this.items[i].path.replace('/', path.sep),
                    );

                    savePromises.push(this.createFilePathDirectories.call(this, filePath));

                    savePromises.push(fs.promises.writeFile(
                        filePath,
                        this.items[i].content,
                        {
                            encoding: 'utf-8',
                        },
                    ));
                }

                await Promise.all(savePromises);

                this.$emit('saved');

                this.$bvToast.toast('The files were successfully saved.', {
                    variant: 'success',
                    toaster: 'b-toaster-top-center',
                });

                ipcRenderer.send('dir-open', this.destinationPath);
            } catch (e) {
                this.$emit('failed');

                this.$bvToast.toast('The files could not be saved.', {
                    variant: 'warning',
                    toaster: 'b-toaster-top-center',
                });
            }

            this.busy = false;
        },
    },
};
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
                    v-model="destinationPath"
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
                v-for="(item, key) in items"
            >
                <div
                    :key="key"
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
                    <div class="ml-auto">
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
