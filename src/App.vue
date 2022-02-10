<template>


    <!-- <div style="width: 100px;background:red" >100</div>
    <div style="width: 200px;background:green" >200</div>
    <div style="width: 300px;background:grey" >300</div>     -->
    <v-app id="app" style="height: 500px;">
			<v-container  style="height: 500px;">
             <location-tree-view
              :items="initialTreeItems"
              title="Location tree"
              @refresh="loadTree"
               contentMenuId="contentMenuFilled"
            />
        <!-- <v-row style="flex-grow:0" no-gutters >
          <v-col>
             <tree-view :items="filledItems" title="Only filled shelfs"  id="tree1" />
          </v-col>
          <v-divider vertical></v-divider>
          <v-col >
              <tree-view :items="emptyItems"  title="Only empty shelfs"/>
          </v-col>
        </v-row> -->
      	</v-container>  
       <v-footer fixed class="white d-flex justify-end">
				<v-btn class="ma-2" @click="Save(true,true)">Save</v-btn>
				<v-btn class="ma-2" @click="Reload()">Revent changes</v-btn>
			</v-footer>

	
	</v-app>
</template>

<script>
import tree from "./data.js";
import { getEmptyTree, getFilledTree } from "./components/ArrayFunctions.js";
import LocationTreeView from "./components/LocationTreeView.vue";
//import treeView from "./components/treeView.vue";
export default {
  name: "App",
  components: {
 //   treeView,
 	  LocationTreeView,   
  },

  data: () => ({
    initialTreeItems:tree.children,
    emptyItems: getEmptyTree(tree).children,
    filledItems: getFilledTree(tree).children,
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
