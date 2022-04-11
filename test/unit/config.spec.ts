import {decompressTarFile} from "../../src/renderer/domains/fs/decompress";
import * as path from "path";
import {parseTrainConfig} from "../../src/renderer/domains/train-config/read";
import fs from "fs";
import {decryptRSAPrivateKey} from "../../src/renderer/domains/encryption/utils/rsa";
import {readTrainResult} from "../../src/renderer/domains/train-result/module";
import {TrainResultSourceType} from "../../src/renderer/domains/train-result/constants";

describe('src/renderer/domains/train-config*.ts', () => {
    const resultFilePath = path.join(__dirname, '..', 'data', 'result.tar');
    const privateKeyFilePath = path.join(__dirname, '..', 'data', 'private.pem');

    it('should read train-config of tar file', async () => {
        const files = await decompressTarFile(resultFilePath);

        expect(files).toBeDefined();
        expect(files.length).toEqual(2);

        let privateKey = await fs.promises.readFile(privateKeyFilePath, { encoding: 'utf-8' });
        let privateKeyDecrypted = decryptRSAPrivateKey(privateKey, 'leuko');

        const {config, key} = await parseTrainConfig({
            files,
            privateKey: privateKeyDecrypted
        });

        expect(config).toBeDefined();
        expect(key).toBeDefined();
    });

    it('should load train result', async () => {
        let privateKey = await fs.promises.readFile(privateKeyFilePath, { encoding: 'utf-8' });
        let privateKeyDecrypted = decryptRSAPrivateKey(privateKey, 'leuko');

        const {files, config} = await readTrainResult({
            source: resultFilePath,
            sourceType: TrainResultSourceType.FILE,
            rsaPrivateKey: privateKeyDecrypted
        });

        expect(config).toBeDefined();
        expect(files.length).toEqual(1);

        expect(files[0].decrypted).toEqual(true);
        expect(files[0].content.toString('utf-8')).toEqual('acc\n1.0 \n');
        expect(files[0].path).toEqual('station_acc.csv');
    })
});
