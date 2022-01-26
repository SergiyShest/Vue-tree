<template>
  <div id="app">
    <v-app id="inspire">
      <vue-simple-context-menu
        :elementId="'myContextMeny'"
        :options="contextMenuItems"
        :ref="'contextMenu'"
        @option-clicked="contextMenuClicked"
      >
      </vue-simple-context-menu>
      <v-container>
        <v-row>
          <v-col>
            <v-card class="mx-auto" max-width="500" max-height="1000">
              <v-card-title
                ><v-row justify="space-between"   >
                  Only filled shelf
                  <v-checkbox  label="open all" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-treeview
                  style="height: 800px; overflow-y: auto"
                  :items="notEmptyItems"
                  :filter="filter"
                  activatable
                  item-key="Id"
                  open-on-click
                >
                  <template v-slot:prepend="{ item, open }">
                    <drag
                      @contextmenu.prevent.stop="
                        handleContextMenu($event, item)
                      "
                      v-if="CanMove(item)"
                      class="drag"
                      :data="item"
                      key="item.Id"
                      @cut="removeContent(item)"
                    >
                      <img
                        :src="require('@/assets/images/' + getSrc(item, open))"
                        height="32px"
                        width="32px"
                      />
                      <div v-if="item.Content.length > 0">
                        <v-icon> mdi-code-json </v-icon>
                      </div>
                    </drag>

                    <img
                      v-else
                      :src="require('@/assets/images/' + getSrc(item, open))"
                      height="32px"
                      width="32px"
                    />
                  </template>
                </v-treeview>
              </v-card-text>
            </v-card>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col class="pa-6" cols="6">
            <template>
              <v-card class="mx-auto" max-width="500">
                <v-card-title>Only empty shelf</v-card-title>
                <v-card-text>
                  <v-treeview
                    style="height: 800px; overflow-y: auto"
                    :items="emptyItems"
                    :filter="filter"
                    activatable
                    return-object
                    item-key="Id"
                    open-all
                    open-on-click
                  >
                    <template v-slot:prepend="{ item, open }">
                      <drop
                        :id="item.Id"
                        v-if="CanTarget(item)"
                        class="cut"
                        @drop="onDrop($event, item)"
                        mode="cut"
                      >
                        <img
                          :src="
                            require('@/assets/images/' + getSrc(item, open))
                          "
                          height="32px"
                          width="32px"
                        />
                        <div v-if="item.Content.length > 0">
                          <v-icon> mdi-code-json </v-icon>
                        </div>
                      </drop>
                      <img
                        v-else
                        :src="require('@/assets/images/' + getSrc(item, open))"
                        height="32px"
                        width="32px"
                      />
                    </template>
                  </v-treeview>
                </v-card-text>
              </v-card>
            </template>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import tree from "./data.js";
import { getEmptyTree, getFilledTree } from "./ArrayFunctions.js";
import { Drag, Drop, DropList } from "vue-easy-dnd";
import VueSimpleContextMenu from "vue-simple-context-menu";
export default {
  name: "App",
  components: {
    Drag,
    DropList,
    Drop,
    VueSimpleContextMenu,
  },

  data: () => ({
    searchText: null,
    search: null,
    barkodeSearch: true,
    files: {
      html: "mdi-language-html5",
      js: "mdi-nodejs",
      json: "mdi-code-json",
      md: "mdi-language-markdown",
      pdf: "mdi-file-pdf",
      png: "mdi-file-image",
      txt: "",
      xls: "mdi-file-excel",
      doc: "mdi-apps",
    },
    displaced: [],
    selection: [],
    items: [],
    emptyItems: getEmptyTree(tree).children,
    notEmptyItems: getFilledTree(tree).children,
    contextMenuItems: [
      {
        name: "Clear",
        slug: "clear",
      },
      {
        name: "Show",
        slug: "show",
      },
      {
        name: "Add",
        slug: "Add",
      },
    ],
  }),
  computed: {
    openNames() {
      var names = [];
      for (var i = 0; i < this.open.length; i++) {
        names.push(this.open[i].name);
      }
      return names;
    },
    filter() {
      if (this.barkodeSearch) {
        return (item, search, textKey) => {
          if (item.Content.length > 0) {
            for (var i = 0; i < item.Content.length; i++) {
              var sample = item.Content[i];
              if (sample.barcode.indexOf(search) > -1) {
                console.log(sample);
                return true;
              }
            }
          }
        };
      } else {
        return (item, search, textKey) => {
          console.log(textKey);
          return item[textKey].indexOf(search) > -1;
        };
      }
    },
  },

  methods: {
    handleContextMenu(event, item) {
      this.$refs.contextMenu.showMenu(event, item);
    },
    contextMenuClicked(event) {
      switch (event.option.slug) {
        case "clear":
          console.log(event.option.name);
          break;
        case "show":
          console.log(event.option.name);
          break;
        case "add":
          console.log(event.option.name);
          break;
      }
    },
    getSrc(item, empty) {
      var img = "folder.png";
      if (/Freezer/.test(item.name)) img = "refrigerator.png";
      if (/Shelf/.test(item.name)) {
        if (this.HasContent(item)) {
          img = "shelf.png";
        } else {
          img = "shelfEmpty.png";
        }
      }

      if (/Rack/.test(item.name)) img = "rack.png";
      if (/Row/.test(item.name)) img = "row.png";
      return img;
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
    onDrop(e, item) {
      item.children = e.data.children;
      e.data.children = [];
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
  height: 30px;
  background-color: rgb(220, 220, 255);
  display: inline-flex;
  align-items: left;
  justify-content: left;
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

.cut {
  margin: 20px 10px;
  border: 1px solid black;
  width: 60px;
  height: 30px;
  display: inline-block;
  position: relative;
  flex: 1;
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

.vue-simple-context-menu {
  top: 0;
  left: 0;
  margin: 0, 0;
  padding: 0, 0;
  display: none;
  list-style: none;
  position: absolute;
  z-index: 1000000;
  background-color: white;
  border-bottom-width: 0px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  box-shadow: 10px 3px 6px 0 rgba(0, 0, 0, 0.4);
  border-radius: 2px;
}

.vue-simple-context-menu--active {
  display: block;
}

.vue-simple-context-menu__item {
  display: flex;
  color: black;
  cursor: pointer;
  padding: 13px, 6px;
  margin-left: -10px;
  margin-right: 5px;
  align-items: center;
}
.vue-simple-context-menu__item:hover {
  background-color: #ecf0f1;
}
/*	color: white;*/

.vue-simple-context-menu__divider {
  box-sizing: content-box;
  height: 2px;
  background-color: gray;
  padding: 4px 0;
  background-clip: content-box;
  pointer-events: none;
}
	.v-text-field--box .v-input__control .v-input__slot,
	.v-text-field--outline .v-input__control .v-input__slot,
	.v-text-field .v-input__control .v-input__slot {
		min-height: 45px;
		display: flex !important;
		align-items: center !important;
		margin: 5px;
  }
</style>
