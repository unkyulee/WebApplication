<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs10 sm8 md4>
        <v-card :class="ui.class" :style="ui.style">
          <template v-for="(screen, index) in ui.screens">
            <text-component
              :key="index"
              v-if="screen.type == 'text'"
              v-bind:ui="screen"
              v-bind:data="data"
            />
            <input-component
              :key="index"
              v-if="screen.type == 'input'"
              v-bind:ui="screen"
              v-bind:data="data"
            />
            <button-component
              :key="index"
              v-if="screen.type == 'button'"
              v-bind:ui="screen"
              v-bind:data="data"
            />
          </template>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TextComponent from "../../ui/text/TextComponent.vue";
import InputComponent from "../../ui/input/InputComponent.vue";
import ButtonComponent from "../../ui/button/ButtonComponent.vue";

export default {
  inject: [
    "AuthService",
     "EventService",
     "ConfigService"
     ],
  components: {
    TextComponent,
    InputComponent,
    ButtonComponent
  },
  data: function() {
    return {
       ui: this.ConfigService.get('login'),
       data: {}
    };
  },
  mounted: function() {
    // listen to drawer-toggle event
    this.EventService.$on("login", this.login);
  },
  destroyed: function() {
    // stop listen to drawer-toggle event
    this.EventService.$off("login", this.login);
  },
  methods: {
    login: async function() {
      // perform login
      let authenticated = await this.AuthService.authenticate(this.data);
      if (authenticated) {
        // login success
        this.EventService.$emit("authenticated");
      } else {
        alert("login failed");
      }
    }
  }
};
</script>