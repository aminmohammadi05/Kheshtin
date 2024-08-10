import { Event } from './event';

export class EventImage {
    imageId: number;
    name: string;
    imageUrl: string;
    thumbnail: string;
    size: number;
    createUserId: number;
    fileExtension: string;
    eventId: string;
    event: Event;
}
