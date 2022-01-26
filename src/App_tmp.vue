<template>
  <div id="app">
    
 
      <drag
        v-for="n in numbers"
        :key="n"
        class="drag"
        :data="n"
        @cut="remove(n)"
        go-back
        >{{ n }}</drag
      >
     <!-- <v-card class="mx-auto" max-width="500">
              Not Empty
               <v-card-text>
                <!-- <v-treeview
                  :items="notEmptyItems"
                  activatable
                  open-all
                  item-key="Id"
                  open-on-click
                >
                  <template v-slot:prepend="{ item, open }">
                    HasContent= {{ HasContent(item) }}
                    <drag @contextmenu.prevent.stop="handleContextMenu($event, item)"
                      v-if="CanMove(item)"
                      class="drag"
                      :data="item"
                      key="item.Id"
                      @cut="removeContent(item)"
                    >
                      <v-icon>
                        {{ getIcon(item, open) }}
                      </v-icon>

                      <div v-if="item.Content.length > 0">
                        <v-icon> mdi-code-json </v-icon>
                        {{ item.Name }}
                      </div>
                    </drag>
                    <v-icon v-else>
                      {{ getIcon(item, open) }}
                    </v-icon>
                    <div v-if="item.Content.length > 0">
                      <v-icon> mdi-code-json </v-icon>
                      count= {{ item.Content.length }}
                    </div>
                  </template>
                </v-treeview> 
              </v-card-text>
            </v-card>-->
   
    <drop class="main" @drop="onDrop">
      <span v-for="(n, index) in dropped" :key="index"
        >Dropped {{ n }};&nbsp;</span
      >
      <drop-mask class="mask"></drop-mask>
    </drop>
    <drop class="main" @drop="onDrop($event, 1)">
      <span v-for="(n, index) in dropped2" :key="index"
        >Dropped {{ n }};&nbsp;</span
      >
      <drop-mask class="mask"></drop-mask>
    </drop>
  </div>
</template>

<script>
import tree from "./data.js";
import { getEmptyTree, getFilledTree } from "./ArrayFunctions.js";
import { Drag, Drop, DropList, DropMask } from "vue-easy-dnd";
import VueSimpleContextMenu from "vue-simple-context-menu";
export default {
  name: "App",
  components: {
    Drag,
    Drop,
    DropMask,
    VueSimpleContextMenu,
  },
  data: function () {
    return {
      numbers: [1, 2, 3, 4, 5],
      dropped: [],
      dropped2: [],

    }  },
  methods: {

			handleContextMenu(event, item) {
				this.$refs.contextMenu.showMenu(event, item)
			},
			contextMenuClicked(event) {
				if (event.option.slug == "delete") {
				console.log(event.item);
				}
			},

    getIcon(item, open) {
      if (/Freezer/.test(item.name)) return "mdi-file-pdf";
      if (/Shelf/.test(item.name)) return "mdi-file-image";
      if (/Rack/.test(item.name)) return "mdi-file-excel";
      if (/Row/.test(item.name)) return "mdi-apps";
      return "mdi-folder";
    },
    CanMove(item) {
      if (item) {
        if (/Shelf/.test(item.name)) {
          return this.HasContent(item);
        }
        //if(/Rack/.test(item.name))return true;
        //if(/Row/.test(item.name))return true;
      }
      return false;
    },
    CanTarget(item) {
      if (item) {
        if (/Shelf/.test(item.name)) {
          return !this.HasContent(item);
        }
        //if(/Rack/.test(item.name))return true;
        //if(/Row/.test(item.name))return true;
      }
      return false;
    },
    onDrop(e) {
      this.dropped.push(e.data);
    },    SonDrop(s, e) {
      console.log(s);
      console.log(e);
    },
    removeContent(item) {
      item.Content = [];
      item.children = [];
    },
    HasContent(item) {
      if (item.Content.length > 0) {
        return true;
      }
      for (var i = 0; i < item.children.length; i++) {
        var element = item.children[i];
        if (this.HasContent(element)) {
          return true;
        }
      }
      return false;
    },
    HasNotContent(item) {
      if (item.Content.length == 0 && item.children.length == 0) {
        return true; //not content and chaild
      }

      for (var i = 0; i < item.children.length; i++) {
        var element = item.children[i];
        if (this.HasNotContent(element)) {
          return true;
        }
      }
      return false;
    },

    Search() {
      console.log("ddd");
      this.open = this.selection;
    },
  
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
  font-family: "Roboto";
}

.drag {
  width: 60px;
  height: 60px;
  background-color: rgb(220, 220, 255);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 10px 10px 0 10px;
  font-size: 20px;
  transition: all 0.5s;
}

.main {
  margin: 20px 10px;
  border: 1px solid black;
  height: 200px;
  position: relative;
}

.mask {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid black;
  background-color: rgba(255, 0, 0, 0.2);
  width: 200px;
  height: 100px;
}

.mask::before {
  content: "MASK";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: rgba(0, 0, 0, 0.4);
  font-size: 25px;
  font-weight: bold;
}

.drop-allowed {
  background-color: rgba(0, 255, 0, 0.2);
}

.drop-forbidden {
  background-color: rgba(255, 0, 0, 0.2);
}

.drop-in {
  box-shadow: 0 0 5px rgba(0, 0, 255, 0.4);
}

.list-enter,
.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  position: absolute;
}
</style>
