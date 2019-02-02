<template>
  <v-content>
    <v-container fluid fill-height>{{nav}}</v-container>
  </v-content>
</template>

<script>
export default {
    inject: [
        "ConfigService"
        ],
        data: function() {
            return {
                nav: {}
            }
        },
    watch: {
    '$route' (to) {
      // find the matching navigation
      let navigations = this.ConfigService.get('navigations')
      if(navigations) {
          // search if any matches in the top levvel nav
          this.nav = navigations.find(x => x.url == to.path)
          // search within the children
          if(!this.nav) {
            for(let nav of navigations) {
              if(nav.type == 'collapse' && nav.children) {
                this.nav = nav.children.find(x => x.url == to.path)
                if(this.nav) break;
              }
            }
          }
      }
    }
  }
};
</script>