<template>
  <div id="app">
    <v-app id="inspire">
       <v-container>
        <v-row>
          <v-col>
             <tree-view :items="filledItems" title="Only filled shelfs"/>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col class="pa-6" cols="6">
              <tree-view :items="emptyItems"  title="Only empty shelfs"/>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>

<script>

import tree from "./data.js";
import { getEmptyTree, getFilledTree } from "./ArrayFunctions.js";

import treeView from "./components/treeView.vue"
export default {
  name: "App",
  components: {
    treeView
  },

  data: () => ({
    emptyItems: getEmptyTree(tree).children,
    filledItems: getFilledTree(tree).children,
  }),
 
  methods: {

  },
  mounted: function () {
    // this.initItems();
  },
};
</script>
<style>
html,
body {
  height: 100%;
}
</style>
