<template>
  <v-app id="app">

    <v-container fluid> 

       <v-row style="flex-grow:0" no-gutters >
          <v-col>
             <location-tree-view
              :treeNum="1"
              :initialTree="initialTree"
              @refresh="loadTree"
            />
          </v-col>
          <v-divider vertical></v-divider>
          <v-col >
              <location-tree-view
              :treeNum="2"
        
              :initialTree="initialTree"
              @refresh="loadTree"
            />
          </v-col>
        </v-row>
 	</v-container>  
    </v-app> 

</template>

<script>

import tree from "./data.js";
import LocationTreeView from "./components/LocationTreeView.vue"
export default {
  name: "App",
  components: {
    LocationTreeView
  },

  data: () => ({
    initialTree: tree,
  }),
 
  methods: {
loadTree(){}
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
