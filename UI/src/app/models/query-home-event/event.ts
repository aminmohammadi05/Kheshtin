import { BagContentItems } from "./event-bag-content-items";
import { EventTypeContentItems } from "./event-type-content-items";
export interface Event {
    displayText: string;
    contentItemId: string;
    eventType: EventTypeContentItems;
    bag: BagContentItems;
    }
    
 