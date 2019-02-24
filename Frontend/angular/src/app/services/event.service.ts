import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class EventService {

    // event
    onEvent: Subject<any> = new Subject()

    send(event) {
        console.log(event)
        console.trace()
        setTimeout(() => this.onEvent.next(event), 0)
    }

}
