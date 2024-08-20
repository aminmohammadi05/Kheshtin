import { Bag } from "./link-menu-item-bag";
import { LinkMenuItemDetails } from "./link-menu-item-details";
import { BrandList } from "./menu-brand-list";
import { Image } from "./menu-brand-image";

export interface LinkMenuItem {
    id: number;
    megaMenu: boolean;
    displayText: string;
    bag?: Bag;
    linkMenuItem?: LinkMenuItemDetails;
    isDisabled?: boolean;
    toolTipText?: string;
    brandList?: BrandList;
    ovalImage?: Image;
    lightBackground?: string;
    darkBackground?: string;
    urlParameterList: string;
    }