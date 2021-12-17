<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script>
import {
    TrainResultStatus, dropAPITrainResult, getAPITrainResults, mergeDeep,
} from '@personalhealthtrain/ui-common';
import Vue from 'vue';
import Pagination from '../../Pagination';

export default {
    components: { Pagination },
    props: {
        filterItems: Function,
        query: {
            type: Object,
            default() {
                return {};
            },
        },
        withSearch: {
            type: Boolean,
            default: true,
        },
        loadOnInit: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            busy: false,
            items: [],
            q: '',
            meta: {
                limit: 10,
                offset: 0,
                total: 0,
            },
            itemBusy: false,

            resultStatusOptions: TrainResultStatus,
        };
    },
    computed: {
        formattedItems() {
            if (typeof this.filterItems === 'undefined') {
                return this.items;
            }

            return this.items.filter(this.filterItems);
        },
    },
    watch: {
        q(val, oldVal) {
            if (val === oldVal) return;

            if (val.length === 1 && val.length > oldVal.length) {
                return;
            }

            this.meta.offset = 0;

            this.load();
        },
    },
    created() {
        if (this.loadOnInit) {
            this.load();
        }
    },
    methods: {
        clear() {
            this.meta = {
                limit: 10,
                offset: 0,
                total: 0,
            };

            this.items = [];
        },
        async load() {
            if (this.busy) return;

            this.busy = true;

            try {
                const response = await getAPITrainResults(mergeDeep({
                    page: {
                        limit: this.meta.limit,
                        offset: this.meta.offset,
                    },
                }, this.query));

                response.data = [
                    ...response.data,
                    {
                        id: 'xxxx-xxxx-xxxx-xxxx',
                        image: 'master/python/2.7',
                        status: TrainResultStatus.FINISHED,
                        train_id: 'xxxx-xxxx-xxxx-xxxx',
                        train: {
                            id: 'xxxx-xxxx-xxxx-xxxx',
                            name: 'Chu Chu Train',
                        },
                        updated_at: new Date('2021-12-01 12:00:00'),
                    },
                ];

                this.items = response.data;
                const { total } = response.meta;

                this.meta.total = total;
            } catch (e) {
                // ...
            }

            this.busy = false;
        },
        async drop(id) {
            if (this.itemBusy) return;

            this.itemBusy = true;

            try {
                await dropAPITrainResult(id);

                this.dropArrayItem({ id });

                this.$emit('deleted', { id });
            } catch (e) {
                // ...
            }

            this.itemBusy = false;
        },
        goTo(options, resolve, reject) {
            if (options.offset === this.meta.offset) return;

            this.meta.offset = options.offset;

            this.load()
                .then(resolve)
                .catch(reject);
        },

        dropArrayItem(item) {
            const index = this.items.findIndex((el) => el.id === item.id);
            if (index !== -1) {
                this.items.splice(index, 1);
            }
        },
        addArrayItem(item) {
            this.items.push(item);
        },
        editArrayItem(item) {
            const index = this.items.findIndex((el) => el.id === item.id);
            if (index !== -1) {
                for (const key in item) {
                    Vue.set(this.items[index], key, item[key]);
                }
            }
        },
    },
};
</script>
<template>
    <div>
        <slot name="header">
            <div class="d-flex flex-row mb-2">
                <div class="ml-auto">
                    <slot
                        name="header-actions"
                        :load="load"
                        :busy="busy"
                    >
                        <div class="d-flex flex-row">
                            <div>
                                <button
                                    type="button"
                                    class="btn btn-xs btn-dark"
                                    :disabled="busy"
                                    @click.prevent="load"
                                >
                                    <i class="fas fa-sync" /> Refresh
                                </button>
                            </div>
                        </div>
                    </slot>
                </div>
            </div>
        </slot>
        <slot
            name="items"
            :items="formattedItems"
            :busy="busy"
        >
            <div class="c-list">
                <div
                    v-for="(item,key) in formattedItems"
                    :key="key"
                    class="c-list-item mb-2"
                >
                    <div class="c-list-content align-items-center">
                        <div class="c-list-icon">
                            <i class="fa fa-file-archive" />
                        </div>
                        <div>
                            <slot name="item-name">
                                <span class="mb-0">{{ item.train.id }}</span>
                            </slot>
                        </div>

                        <div class="ml-auto">
                            <div class="d-flex flex-column p-1">
                                <div>
                                    <slot
                                        name="item-actions"
                                        :item="item"
                                    >
                                        <div class="d-flex flex-row">
                                            <div>
                                                <button
                                                    v-if="item.status === resultStatusOptions.FINISHED"
                                                    type="button"
                                                    class="btn btn-dark btn-xs"
                                                    :disabled="itemBusy"
                                                    @click.prevent="inspect(item.id)"
                                                >
                                                    <i class="fa fa-search" />
                                                </button>
                                                <button
                                                    type="button"
                                                    class="btn btn-xs btn-danger"
                                                    :disabled="itemBusy"
                                                    @click.prevent="drop(item.id)"
                                                >
                                                    <i class="fas fa-trash" />
                                                </button>
                                            </div>
                                            <slot
                                                name="item-actions-extra"
                                                :busy="busy"
                                                :item-busy="itemBusy"
                                                :item="item"
                                            />
                                        </div>
                                    </slot>
                                </div>
                                <div class="text-right">
                                    <small class="text-muted"><timeago :datetime="item.updated_at" /></small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </slot>

        <div
            v-if="!busy && formattedItems.length === 0"
            slot="no-more"
        >
            <div class="alert alert-sm alert-info">
                No (more) train-results available.
            </div>
        </div>

        <pagination
            :total="meta.total"
            :offset="meta.offset"
            :limit="meta.limit"
            @to="goTo"
        />
    </div>
</template>
