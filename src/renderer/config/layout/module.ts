/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    Component,
    ProviderInterface,
} from '@vue-layout/navigation';
import {
    applyRestrictionForComponents, findTierComponent,
} from '@vue-layout/navigation';
import type { Context } from '@nuxt/types';
import {
    LayoutKey, LayoutSideDefaultNavigation, LayoutTopNavigation,
} from './contants';

export class NavigationProvider implements ProviderInterface {
    protected ctx: Context;

    // -------------------------

    protected primaryItems : Component[] = LayoutTopNavigation;

    protected secondaryDefaultItems : Component[] = LayoutSideDefaultNavigation;

    protected secondaryAdminItems : Component[] = [];

    // -------------------------

    constructor(ctx: Context) {
        this.ctx = ctx;
    }

    // ---------------------------

    async getComponents(tier: number, components: Component[]): Promise<Component[]> {
        if (!await this.hasTier(tier)) {
            return [];
        }

        let items : Component[] = [];

        switch (tier) {
            case 0:
                items = this.primaryItems;
                break;
            case 1: {
                const component: Component = findTierComponent(components, 0) || { id: 'default' };

                switch (component.id) {
                    case 'default':
                        items = this.secondaryDefaultItems;
                        break;
                }

                break;
            }
        }

        return applyRestrictionForComponents(items, {
            hasPermission: (name) => this.ctx.$auth.hasPermission(name),
            isLoggedIn: () => this.ctx.$auth.isLoggedIn(),
            layoutKey: {
                requiredAbilities: LayoutKey.REQUIRED_ABILITIES,
                requiredPermissions: LayoutKey.REQUIRED_PERMISSIONS,
                requiredLoggedIn: LayoutKey.REQUIRED_LOGGED_IN,
                requiredLoggedOut: LayoutKey.REQUIRED_LOGGED_OUT,
            },
        });
    }

    async hasTier(tier: number): Promise<boolean> {
        return [0, 1].indexOf(tier) !== -1;
    }

    async getComponentsActive(url: string): Promise<Component[]> {
        const sortFunc = (a: Component, b: Component) => (b.url?.length ?? 0) - (a.url?.length ?? 0);
        const filterFunc = (item: Component) => {
            if (!item.url) return false;

            if (item.rootLink) {
                return url === item.url;
            }

            return url === item.url || url.startsWith(item.url);
        };

        // ------------------------

        const secondaryDefaultItems = this.flattenNestedComponents(this.secondaryDefaultItems)
            .sort(sortFunc)
            .filter(filterFunc);

        if (secondaryDefaultItems.length > 0) {
            return [
                this.primaryItems[0],
                secondaryDefaultItems[0],
            ];
        }

        return [];
    }

    // ----------------------------------------------------

    private flattenNestedComponents(components: Component[]) : Component[] {
        const output = [...components];

        for (let i = 0; i < components.length; i++) {
            if (components[i].components) {
                output.push(...this.flattenNestedComponents(components[i].components as Component[]));
            }
        }

        return output;
    }
}
