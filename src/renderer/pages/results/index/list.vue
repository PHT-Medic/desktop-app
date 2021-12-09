<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script>
import TrainResultList from '../../../components/domains/train-result/TrainResultList';
import { LayoutKey } from '../../../config/layout/contants';

export default {
    components: { TrainResultList },
    data() {
        return {};
    },
    meta: {
        [LayoutKey.REQUIRED_LOGGED_IN]: true,
    },
    computed: {
        query() {
            return this.$store.getters['auth/loggedIn']
                ? {
                    filter: {
                        user_id: this.$store.getters['auth/userId'],
                    },
                    sort: {
                        created_at: 'DESC',
                    },
                } : {};
        },
    },
};
</script>
<template>
    <train-result-list :query="query" />
</template>
