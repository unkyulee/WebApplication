import { Component } from '@angular/core';

// user services
import { BaseComponent } from '../../ui/base.component';

@Component({
	selector: 'ping',
	template: '',	
})
export class PingComponent extends BaseComponent {	

	ngOnInit() {
    let url = this.config.get("host");
    console.log(`ping ${url}`)
		this.websocket.connect(url).subscribe(x => {
      console.log(x);
    })
	}

	ngOnDestroy() {
		this.websocket.close();
	}
}
