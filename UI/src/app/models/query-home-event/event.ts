
import { EventStep } from "./event-step";

export interface Event {
    width: number;
    label: string;
    start: string;
    end: string;
    group: number;
    left: number;
    color: string;
    opacity: number;
    title: string;
    contentItemId: string;
    side: string;
    steps: EventStep[]
    }
    
 