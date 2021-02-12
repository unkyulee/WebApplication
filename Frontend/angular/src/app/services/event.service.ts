import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class EventService {
    // event
    onEvent: BehaviorSubject<any> = new BehaviorSubject<any>({})

    send(event) {
        this.onEvent.next(event)
    }

    sendAsync(event, delay = 0) {
        setTimeout(() => this.onEvent.next(event), delay)
    }
}
