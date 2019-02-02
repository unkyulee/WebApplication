<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs10 sm8 md4>
        <v-card :class="classObject" :style="styleObject">
          <template v-for="(screen, index) in ui.screens">
            <text-component
              :key="index"
              v-if="screen.type == 'text'"
              v-bind:ui="screen"
              v-bind:data="screen"
            />
            <input-component
              :key="index"
              v-if="screen.type == 'input'"
              v-bind:ui="screen"
              v-bind:data="screen"
            />
            <button-component
              :key="index"
              v-if="screen.type == 'button'"
              v-bind:ui="screen"
              v-bind:data="screen"
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
  inject: ["AuthService", "EventService"],
  components: {
    TextComponent,
    InputComponent,
    ButtonComponent
  },
  data: function() {
    return {
      id: "",
      password: "",
      ui: window.__CONFIG__.login
    };
  },
  methods: {
    login: async function() {
      // perform login
      let authenticated = await this.AuthService.authenticate(
        this.id,
        this.password
      );
      if (authenticated) {
        // login success
        this.EventService.$emit("authenticated");
      } else {
        alert("login failed");
      }
    }
  },
  computed: {
    styleObject: function() {
      let v = null;
      if (window.__CONFIG__.login && window.__CONFIG__.login.style) {
        v = window.__CONFIG__.login.style;
      }
      return v;
    },
    classObject: function() {
      let v = null;
      if (window.__CONFIG__.login && window.__CONFIG__.login.class) {
        v = window.__CONFIG__.login.class;
      }
      return v;
    }
  }
};
</script>