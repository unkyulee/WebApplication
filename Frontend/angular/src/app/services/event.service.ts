import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class EventService {
    // event
    onEvent: BehaviorSubject<any> = new BehaviorSubject<any>({})

    send(event) {
        this.onEvent.next(event)
    }

    sendAsync(event) {
        setTimeout(() => this.onEvent.next(event))
    }
}
