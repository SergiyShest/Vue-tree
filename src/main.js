import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.component("image-icon", {
  template: `<v-img :src="imgsrc" max-width="32" ></v-img>`,
  props: ["imgsrc"]
});


window.globalEvent = new Vue();
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
