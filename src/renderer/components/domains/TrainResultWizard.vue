<!--
  - Copyright (c) 2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import type { TrainConfig } from '@personalhealthtrain/core';
import { PrivateKey, PublicKey } from 'paillier-bigint';
import { storeToRefs } from 'pinia';
import type { ResguardResult } from 'resguard';
import type { Ref } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { FormWizard, TabContent, WizardButton } from 'vue3-form-wizard';
import type { TarFile, TrainResultOutput } from '../../../core';
import { IPCChannel, useIPCRenderer } from '../../core/electron';
import { useAuthStore } from '../../store/auth';
import { useSecretStore } from '../../store/secret';
import AlertPrivateKey from '../alert/AlertPrivateKey.vue';
import TrainResultWizardBase from './TrainResultWizardBase.vue';
import TrainResultWizardMeta from './TrainResultWizardMeta.vue';
import TrainResultWizardSaver from './TrainResultWizardSaver.vue';

export default defineComponent({
    components: {
        TrainResultWizardMeta,
        AlertPrivateKey,
        TrainResultWizardSaver,
        TrainResultWizardBase,
        FormWizard,
        WizardButton,
        TabContent,
    },
    setup(_props, { emit }) {
        const secretStore = useSecretStore();
        const secretRefs = storeToRefs(secretStore);

        const authStore = useAuthStore();
        const authRefs = storeToRefs(authStore);

        const source = ref<null | string>(null);
        const destinationPath = ref<null | string>(null);
        const files = ref<TarFile[]>([]);
        const config = ref<TrainConfig | null>();

        const id = computed(() => {
            if (!config.value) {
                return undefined;
            }

            if (
                config.value &&
                config.value.id
            ) {
                return config.value.id;
            }

            if (
                config.value &&
                config.value['@id']
            ) {
                return config.value['@id'];
            }

            return undefined;
        });

        const read = async () => {
            if (!secretRefs.rsaPrivateKey.value || !source.value) return;

            let paillierKey;

            if (
                secretRefs.hePrivateKey.value &&
                secretRefs.hePublicKey.value
            ) {
                const publicData = secretRefs.hePublicKey.value;
                const privateData = secretRefs.hePrivateKey.value;

                const publicKey = new PublicKey(BigInt(publicData.n), BigInt(publicData.g));
                paillierKey = new PrivateKey(
                    BigInt(privateData.lambda),
                    BigInt(privateData.mu),
                    publicKey,
                );
            }

            const { error, data } = await useIPCRenderer()
                .invoke(IPCChannel.RESULT_READ, {
                    token: authRefs.accessToken.value,
                    source: source.value,
                    rsaPrivateKey: secretRefs.rsaPrivateKey.value,
                    paillierPrivateKey: paillierKey,
                }) as ResguardResult<TrainResultOutput, Error>;

            if (error) {
                throw error;
            }

            config.value = data.config;
            files.value = data.files;
        };

        const index = ref(0);

        const steps = [
            'base', // file or remote
            'meta',
            'save',
        ];

        const canPassBaseStep = async () => {
            if (!source.value) {
                throw new Error('A file or remote source must be defined.');
            }

            if (!secretRefs.rsaPrivateKey.value) {
                throw new Error('A private key must be selected.');
            }

            return read();
        };

        const passWizardStep = () : Promise<boolean> => new Promise((resolve, reject) => {
            const step = steps[index.value];
            let promise : Promise<any>;

            switch (step) {
                case 'base': {
                    promise = canPassBaseStep();
                    break;
                }
                case 'meta': {
                    promise = Promise.resolve();
                    break;
                }
                default: {
                    promise = new Promise<any>((resolve, reject) => {
                        reject(new Error('...'));
                    });
                }
            }

            promise
                .then(() => resolve(true))
                .catch((e) => reject(e));
        });

        const wizardNode : Ref<typeof FormWizard | null> = ref(null);

        const prevWizardStep = () => {
            if (wizardNode.value) {
                wizardNode.value.prevTab();
            }
        };

        const nextWizardStep = () => {
            if (wizardNode.value) {
                wizardNode.value.nextTab();
            }
        };

        const handleWizardChangedEvent = (prevIndex: number, nextIndex: number) => {
            index.value = nextIndex;
        };

        const handleWizardErrorEvent = (e?: Error) => {
            if (e instanceof Error) {
                emit('failed', e);
            }
        };

        const handleWizardFinishedEvent = () => {
            emit('finished');
        };

        const handleSource = (input: string) => {
            source.value = input;
        };

        const handleDestinationPath = (input: string) => {
            destinationPath.value = input;
        };

        const saverNode = ref<null | typeof TrainResultWizardSaver>(null);
        const save = async () => {
            if (!saverNode.value) {
                return;
            }

            await saverNode.value.save();
        };

        return {
            handleWizardChangedEvent,
            handleWizardErrorEvent,
            handleWizardFinishedEvent,

            prevWizardStep,
            nextWizardStep,
            passWizardStep,

            wizardNode,

            handleSource,
            handleDestinationPath,

            id,
            files,
            config,
            source,

            save,
            saverNode,
        };
    },
});
</script>
<template>
    <FormWizard
        ref="wizardNode"
        color="#333"
        :start-index="0"
        @on-change="handleWizardChangedEvent"
        @on-complete="handleWizardFinishedEvent"
        @on-error="handleWizardErrorEvent"
    >
        <template #title>
            <h4 class="wizard-title">
                <i class="fa fa-hat-wizard" /> Result Wizard
            </h4>
            <p class="category">
                Decrypt and save a train result via file or remote api
            </p>
        </template>

        <template #footer="props">
            <div class="wizard-footer-left">
                <WizardButton
                    v-if="props.activeTabIndex > 0 && !props.isLastStep"
                    :style="props.fillButtonStyle"
                    @click.native="prevWizardStep"
                >
                    Back
                </WizardButton>
            </div>
            <div class="wizard-footer-right">
                <WizardButton
                    v-if="!props.isLastStep"
                    class="wizard-footer-right"
                    :style="props.fillButtonStyle"
                    @click.native="nextWizardStep"
                >
                    Next
                </WizardButton>

                <WizardButton
                    v-else
                    class="wizard-footer-right finish-button"
                    :style="props.fillButtonStyle"
                    @click.prevent="save"
                >
                    Save
                </WizardButton>
            </div>
        </template>

        <AlertPrivateKey />

        <TabContent
            title="Base"
            :before-change="passWizardStep"
        >
            <TrainResultWizardBase @selected="handleSource" />
        </TabContent>

        <TabContent
            title="Meta"
            :before-change="passWizardStep"
        >
            <TrainResultWizardMeta
                v-if="config"
                :config="config"
            />
        </TabContent>

        <TabContent
            title="Save"
            :before-change="passWizardStep"
        >
            <TrainResultWizardSaver
                :id="id"
                ref="saverNode"
                :files="files"
            />
            <!-- -->
        </TabContent>
    </FormWizard>
</template>
