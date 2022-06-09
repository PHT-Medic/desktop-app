/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {PrivateKey, PublicKey} from "paillier-bigint";

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
       const encrypted = publicKey.encrypt(BigInt(val));
       expect(privateKey.decrypt(encrypted)).toEqual(BigInt(5000));

    })
});
