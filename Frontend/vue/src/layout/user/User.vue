<template>
  <v-menu offset-y class="pa-2">
    <div slot="activator">User name here</div>
    <v-list>
      <v-list-tile v-for="(item, index) in items" :key="index" @click.stop="logout">
        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  inject: ["EventService", "AuthService"],
  data: () => ({
    items: [
      {
        title: "Logout"
      }
    ]
  }),
  methods: {
      logout: function() {
          this.AuthService.logout();
          this.EventService.$emit('logout')
      }
  }
};
</script>