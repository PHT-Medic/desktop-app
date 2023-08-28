<!--
  - Copyright (c) 2021-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script>
import { defineComponent } from 'vue';
import { BContainer } from 'bootstrap-vue-next';

export default defineComponent({
    components: {
        BContainer,
    },
    data() {
        return {
            startYear: 2021,
        };
    },
    computed: {
        year() {
            const year = new Date().getFullYear();

            return year === this.startYear ? year : `${this.startYear}-${year}`;
        },
    },
});
</script>
<template>
    <div>
        <div class="page-footer">
            <div class="copyright">
                &copy; PHT-Medic {{ year }} &bull; Desktop-App - Design & Code by <a
                    href="https://tada5hi.net"
                    target="_blank"
                >Peter Placzek</a>
            </div>
        </div>
        <BContainer
            :toast="{root: true}"
            fluid="sm"
            position="position-fixed"
            style="z-index: 9999"
        />
    </div>
</template>
