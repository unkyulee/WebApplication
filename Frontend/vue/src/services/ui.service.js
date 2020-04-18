const obj = require('object-path');
import rest from './rest.service';
import config from './config.service';

export default {
	storage: {},
	async get(uiElementId) {
    let uiElement = obj.get(this.storage, uiElementId);

		// return if stored uiElement exists
		if (!uiElement) {
			// if storage doesn't have it then load it
			let url = `${config.get('url')}/ui.element?uiElementId=${uiElementId}`;
			let response = await rest.request(url);
			// save the uiElement
      this.storage[uiElementId] = response.data;
      uiElement = response.data;
		}

    return uiElement;
	}
};
