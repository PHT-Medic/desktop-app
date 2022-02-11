/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import tar, { FileStat } from 'tar';
import { TarFile } from '../train-result/type';

export async function decompressTarFile(filePath: string): Promise<TarFile[]> {
    return new Promise(((resolve, reject) => {
        const files: TarFile[] = [];

        tar.t({
            file: filePath,
            onentry(entry: FileStat) {
                const data: Buffer[] = [];

                if (entry.type.toString() !== 'File') {
                    return;
                }

                entry.on('data', (c: Buffer) => data.push(c));
                entry.on('end', () => {
                    files.push({
                        path: entry.path.toString(),
                        content: Buffer.concat(data).toString('utf-8'),
                    });
                });
            },
        }, [], (err) => {
            if (err) reject(err);

            resolve(files);
        });
    }));
}
