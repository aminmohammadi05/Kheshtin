import { EventImage } from "./event-image";
import { EventStep } from "./event-step";

export interface BagContentItems {
    contentItems: (EventStep | EventImage)[];
    }