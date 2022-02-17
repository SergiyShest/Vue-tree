<template>


    <!-- <div style="width: 100px;background:red" >100</div>
    <div style="width: 200px;background:green" >200</div>
    <div style="width: 300px;background:grey" >300</div>     -->
    <v-app id="app" style="height: 500px;">
			<v-container  style="height: 500px;">

       <v-row style="flex-grow:0" no-gutters >
          <v-col>
             <location-tree-view
              onlyFilled=true
              :tree="initialTree"
              @refresh="loadTree"
            />
          </v-col>
          <v-divider vertical></v-divider>
          <v-col >
              <location-tree-view
              onlyEmpty=false              
              :tree="initialTree"
              @refresh="loadTree"
            />
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
import LocationTreeView from "./components/LocationTreeView.vue";
//import treeView from "./components/treeView.vue";
export default {
  name: "App",
  components: {
 //   treeView,
 	  LocationTreeView,   
  },

  data: () => ({
    initialTree:tree,

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
