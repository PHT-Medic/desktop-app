/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { ReadEntry } from 'tar';
import { t } from 'tar';
import type { TarFile } from '../train-result/type';

export async function decompressTarFile(filePath: string): Promise<TarFile[]> {
    const files: TarFile[] = [];

    try {
        await t({
            file: filePath,
            onentry(entry: ReadEntry) {
                const data: Buffer[] = [];

                if (
                    typeof entry.type === 'undefined' ||
                    entry.type.toString() !== 'File'
                ) {
                    return;
                }

                entry.on('data', (c: Buffer) => data.push(c));
                entry.on('end', () => {
                    files.push({
                        path: entry.path.toString(),
                        content: Buffer.concat(data),
                    });
                });
            },
        });

        return files;
    } catch (e) {
        return [];
    }
}
