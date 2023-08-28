/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export enum IPCChannel {
    CRYPTO_SIGN = 'crypto-sign',
    CRYPTO_RSA_GENERATE = 'crypto-rsa-generate',
    CRYPTO_RSA_KEY_DECRYPT = 'crypto-rsa-key-decrypt',
    CRYPTO_HE_GENERATE = 'crypto-he-generate',

    FS_READ_FILE = 'fs-read-file',
    FS_WRITE_FILE = 'fs-write-file',
    FS_MKDIR = 'fs-mkdir',

    COPY_TO_CLIPBOARD = 'copy-to-clipboard',

    DIR_SELECT = 'dir-select',
    DIR_OPEN = 'dir-open',

    RESULT_FILE_SELECT = 'result-file-select',
    RESULT_READ = 'result-read',

}
