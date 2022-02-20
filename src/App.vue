<template>
  <v-app id="app">

    <v-container fluid> 

       <v-row style="flex-grow:0" no-gutters >
          <v-col>
             <location-tree-view
              :treeNum="1"
              title="Sourse:"
              :initialTree="initialTree"
              @refresh="loadTree"
            />
          </v-col>
          <v-divider vertical></v-divider>
          <v-col >
              <location-tree-view
              :treeNum="2"
               title="Target:"
              :initialTree="initialTree"
              :movedTypes="[]"
              :targetCondition="targetCondition"
              @refresh="loadTree"
            />
          </v-col>
        </v-row>
 	</v-container>  
    </v-app> 

</template>

<script>

import {tree,tree2} from "./data.js";
import LocationTreeView from "./components/LocationTreeView.vue"
export default {
  name: "App",
  components: {
    LocationTreeView
  },

  data: () => ({
    initialTree: tree2,
    
  }),
 
  methods: {
 targetCondition(sourseItem,targetItem){
     if (sourseItem.Code == "SHELF" && targetItem.Code == "FREEZER") {
            return true;
          }
          if (sourseItem.Code == "RACK" && targetItem.Code == "SHELF") {
            return true;
          }
          if (sourseItem.Code == "ROW" && targetItem.Code == "RACK") {
            return true;
          }
 },   
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
