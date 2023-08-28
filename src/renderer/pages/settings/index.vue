<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script>
import { defineComponent } from 'vue';
import { LayoutKey, LayoutNavigationID } from '../../config/layout/contants';
import { definePageMeta } from '#imports';
import DomainEntityNav from '~/components/DomainEntityNav';

export default defineComponent({
    components: { DomainEntityNav },
    setup() {
        definePageMeta({
            [LayoutKey.NAVIGATION_ID]: LayoutNavigationID.DEFAULT,
        });

        const items = [
            {
                name: 'Overview', icon: 'fas fa-bars', urlSuffix: '',
            },
            {
                name: 'RSA', icon: 'fa fa-key', urlSuffix: '/encryption',
            },
            {
                name: 'Homomorphic', icon: 'fa fa-key', urlSuffix: '/encryption/homomorphic',
            },
        ];

        return {
            items,
        };
    },
});
</script>
<template>
    <div class="container">
        <h1 class="title no-border mb-3">
            <i class="fa fa-cog" /> Settings <span class="sub-title">Management</span>
        </h1>

        <div class="content-wrapper">
            <div class="content-sidebar flex-column">
                <DomainEntityNav
                    :items="items"
                    :path="'/settings'"
                    :direction="'vertical'"
                />
            </div>
            <div class="content-container">
                <NuxtPage />
            </div>
        </div>
    </div>
</template>
