/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { TrainConfig } from '@personalhealthtrain/core';

export type TrainConfigParseContext = {
    content: Buffer | string,
    privateKey: string
};

export type TrainConfigParseOutput = {
    config: TrainConfig,
    key: Buffer
};
