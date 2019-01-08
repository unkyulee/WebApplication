import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class EventService {

    // event
    onEvent: BehaviorSubject<any> = new BehaviorSubject({})

    send(event) {
        setTimeout(() => this.onEvent.next(event), 100)
    }

}
