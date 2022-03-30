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
        expect(files.length).toEqual(3);

        let privateKey = await fs.promises.readFile(privateKeyFilePath, { encoding: 'utf-8' });
        let privateKeyDecrypted = decryptRSAPrivateKey(privateKey, 'leuko');

        const {config, key} = await parseTrainConfig({
            files,
            privateKey: privateKeyDecrypted
        });

        expect(config).toBeDefined();
        expect(key).toEqual('TwvuYEt7NXRRQXHFqzjHI5sxo3n6K-jfXAavVVAzLEE=');
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
        expect(files.length).toEqual(2);
        expect(files[0].decrypted).toEqual(false);
        expect(files[0].path).toEqual('model_0.joblib');

        expect(files[1].decrypted).toEqual(true);
        expect(files[1].path).toEqual('station_acc.csv');
        expect(files[1].content).toEqual("acc\n1.0 \n");
    })
});
