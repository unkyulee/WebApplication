// @ts-nocheck
export default {
    inject: ['event', 'config'],
    data: function () {
        return {
            title: "",
            sub_title: "",
            navigations: [],
            selected: [],
        };
    },
    mounted: async function () {
        // load title
        this.title = this.config.get("name", "");

        // load navigations
        this.navigations = this.config
            .get("nav", [])
            .filter((x) => x.type != "hidden");
    },
}