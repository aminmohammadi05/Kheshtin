import { EventCategorySet } from './event-category-set';

export class EventCategory {
    categoryId: number;
    name: string;
    eventCategorySetList: EventCategorySet[] = [];
}