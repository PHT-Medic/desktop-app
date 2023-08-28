/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export enum TrainResultSourceType {
    FILE = 'file',
    URL = 'url',
}

export enum TrainResultInspectorStatusOption {
    STARTED = 'started',
    LOADING = 'loading',
    LOADED = 'loaded',
    DECRYPTING = 'decrypting',
    DECRYPTED = 'decrypted',
    FINISHED = 'finished',
    FAILED = 'failed',
}
