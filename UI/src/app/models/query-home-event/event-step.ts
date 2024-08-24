import { EventIcon } from "./event-icon";

export interface EventStep {
    start: string;
    end: string;
    icon: string;   
    width: number;
    left: number;
    color: string;
    opacity: number;
    title: string;
    contentItemId: string;
    steps: EventStep[]
    }