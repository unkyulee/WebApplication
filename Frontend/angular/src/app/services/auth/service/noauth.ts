import { EventService } from '../../event.service';

export class NoAuthStrategy {
	constructor(private event: EventService) {}

	async login(data) {
		return;
	}

	async logout() {}

	async isAuthenticated(isAuthenticated$) {
		// return auth result
    isAuthenticated$.next(true);
    this.event.send({name: 'login-success'})

		return true;
	}

	async refreshAuthentication() {
		return;
	}
}
