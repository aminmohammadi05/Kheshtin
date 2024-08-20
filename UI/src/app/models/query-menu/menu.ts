import { Alias } from "./menu-alias";
import { MenuItemsList } from "./menu-item-list";

export interface Menu {
    alias: Alias;
    displayText: string;
    menuItemsList: MenuItemsList;
    }