/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import JsonBig from "json-bigint";
import { JsonBigIntTransformer } from "./type";

let transformer : JsonBigIntTransformer | undefined;

export function useJsonBigIntTransformer() : JsonBigIntTransformer {
    if(typeof transformer !== 'undefined') {
        return transformer;
    }

    transformer = JsonBig({ useNativeBigInt: true });

    return transformer;
}
