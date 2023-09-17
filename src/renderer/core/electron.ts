/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { IpcRenderer } from 'electron';
import { inject } from 'vitron/renderer';

export function useIPCRenderer() : IpcRenderer {
    return inject<IpcRenderer>('ipcRenderer');
}

export {
    IPCChannel,
} from '../../main/constants';
