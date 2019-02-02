<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs10 sm8 md4>
        <v-card class="elevation-8">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field prepend-icon="person" name="id" label="Login" type="email" v-model="id"></v-text-field>
              <v-text-field prepend-icon="lock" name="password" label="Password" id="password" type="password" v-model="password"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" v-on:click="login">Login</v-btn>
            <v-spacer></v-spacer>            
          </v-card-actions>
          <br>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  inject: [
    'AuthService'
    , 'EventService'
  ],
  data: function() {
    return {
      id: ''
      , password: ''
    }
  },
  methods: {
    login: async function() {
      // perform login
      let authenticated = await this.AuthService.authenticate(this.id, this.password)
      if(authenticated) {        
        // login success
        this.EventService.$emit('authenticated')        
      } else {
        alert('login failed')
      }
    }
  }
};
</script>