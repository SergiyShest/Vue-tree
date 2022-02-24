<template>
  <v-app id="app">
    <v-container fluid>
      <v-row style="flex-grow: 0" no-gutters>
        <v-col>
          <location-tree-view
            :treeNum="1"
            title="Sourse:"
            :initialTree="initialTree"
            :activeId="activeId"
            @refresh="loadTree"
          />
        </v-col>
        <v-divider vertical></v-divider>
        <v-col>
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

    <v-footer fixed class="d-flex justify-end">
      <v-btn class="ma-2" style="min-width: 130px" @click="Test()"
        >Select</v-btn
      >
      <v-btn
        class="ma-2"
        style="min-width: 130px; margin-right: 10px"
        @click="CloseThis()"
        >Cancel</v-btn
      >
      <div style="width: 30px" />
    </v-footer>
  </v-app>
</template>

<script>
import { tree, tree2 } from "./data.js";
import LocationTreeView from "./components/LocationTreeView.vue";
export default {
  name: "App",
  components: {
    LocationTreeView,
  },

  data: () => ({
    initialTree: tree,
    activeId:null,
  }),

  methods: {
    targetCondition(sourseItem, targetItem) {
      if (sourseItem.Code == "SHELF" && targetItem.Code == "FREEZER") {
        return true;
      }
      if (sourseItem.Code == "RACK" && targetItem.Code == "SHELF") {
        return true;
      }
      if (sourseItem.Code == "ROW" && targetItem.Code == "RACK") {
        return true;
      }

      if (sourseItem.Code == "SHELF" && targetItem.Code == "SHELF") {
        return true;
      }
      if (sourseItem.Code == "RACK" && targetItem.Code == "RACK") {
        return true;
      }
      if (sourseItem.Code == "ROW" && targetItem.Code == "ROW") {
        return true;
      }
      if (
        sourseItem.ModelId &&
        (targetItem.Code == "ROW" ||
          targetItem.Code == "RACK" ||
          targetItem.Code == "SHELF" ||
          targetItem.Code == "")
      ) {
        return true;
      }
    },
    Test() {
     
      this.activeId=10056
    },
    

    loadTree() {},
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
