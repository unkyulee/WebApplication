import { Subject } from "rxjs";

class EventService {
  // event
  onEvent = new Subject();

  //
  send(event) {
    setTimeout(() => this.onEvent.next(event), 0);
  }
}

export default new EventService()