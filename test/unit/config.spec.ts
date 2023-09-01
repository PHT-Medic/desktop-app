import { decryptRSAPrivateKey} from "../../src/main/core";
import path from "node:path";
import fs from "node:fs";
import {readTrainResult} from "../../src/main/domains/train-result";

describe('src/renderer/domains/train-config*.ts', () => {
    const resultFilePath = path.join(__dirname, '..', 'data', 'result.tar');
    const privateKeyFilePath = path.join(__dirname, '..', 'data', 'private.pem');

    it('should load train result', async () => {
        let privateKey = await fs.promises.readFile(privateKeyFilePath, { encoding: 'utf-8' });
        let privateKeyDecrypted = decryptRSAPrivateKey(privateKey, 'leuko');

        const {files, config} = await readTrainResult({
            source: resultFilePath,
            rsaPrivateKey: privateKeyDecrypted
        });

        expect(config).toBeDefined();
        expect(files.length).toEqual(1);

        expect(files[0].decrypted).toEqual(true);
        expect(files[0].content.toString('utf-8')).toEqual('acc\n1.0 \n');
        expect(files[0].path).toEqual('station_acc.csv');
    })
});
