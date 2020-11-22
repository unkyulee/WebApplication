export default {
	App: [
		{
			title: 'Test App DB',
		},
	],
	Navigation: [
		{
			url: '',
			name: 'Home',
			uiElementIds: ['home-component'],
		},
	],
	UI: [
		{
			_id: 'home-component',
      component: `new Object({
        template: "<button>You clicked me {{ text }} times.</button>",
        data: function() {
          return {
            text: 'this should be displayed',
          }
        },
        mounted() {
          console.log('test component mounted', this.text)
        },
      });`
		},
	],
};
