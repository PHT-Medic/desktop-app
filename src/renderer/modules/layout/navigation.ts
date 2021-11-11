/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { LayoutNavigation } from '../../config/layout'
import { LayoutNavigationID } from '../../modules/layout/contants'
import { LayoutNavigationComponent } from './types'

export function getNavigationComponents () : LayoutNavigationComponent[] {
  return LayoutNavigation
}

export function getNavigationComponentById (
  id: LayoutNavigationID
) : LayoutNavigationComponent | undefined {
  const index = LayoutNavigation.findIndex(navigation => navigation.id === id)
  if (index !== -1) {
    return LayoutNavigation[index]
  }

  return undefined
}
