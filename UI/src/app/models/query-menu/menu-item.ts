import { Bag } from "./link-menu-item-bag";
import { BrandList } from "./menu-brand-list";
import { Image } from "./menu-brand-image";
import { LinkMenuItemDetails } from "./link-menu-item-details";

   export interface MenuItem {
      id: number;
    megaMenu: boolean;
    subMenu: boolean;
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
    
 
    
  