/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import JsonBig from 'json-bigint';
import {PrivateKey, PublicKey} from "paillier-bigint";
import {decryptContentRecursive} from "../../src/renderer/domains/encryption/utils/paillier";
import {useJsonBigIntTransformer} from "../../src/renderer/domains/json-bigint";

describe('src/domains/encryption/utils/paillier.ts', function () {
    it('should encrypt and decrypt', () => {
       const publicKey = new PublicKey(
           BigInt('206556784900512205632512955659188849933'),
           BigInt('26706334840104107641931741690625481832707639941348244570702247911491062097850')
       );

       const privateKey = new PrivateKey(
           BigInt('51639196225128051400623702033056379400'),
           BigInt('27960717018897953100232631915250363870'),
           publicKey
       );

       const val : bigint = BigInt(5000);
       const encrypted = publicKey.encrypt(val);
       expect(decryptContentRecursive(privateKey, encrypted)).toEqual(BigInt(5000));
    });

    it('should parse json big-int', () => {
        const input = '{"key": 27511177347604144749748043945388338495536800836527384846281887219406956289564}';

        const native = JsonBig({ useNativeBigInt: true });
        const parsed = native.parse(input);

        expect(parsed.key).toEqual(BigInt('27511177347604144749748043945388338495536800836527384846281887219406956289564'));
        expect(parsed.key).toEqual(27511177347604144749748043945388338495536800836527384846281887219406956289564n);
    })
});
