<template>
  <div id="app">
    <v-app id="inspire">
     			<vue-simple-context-menu :elementId="'myContextMeny'"
									 :options="contextMenuItems"
									 :ref="'contextMenu'"
									 @option-clicked="contextMenuClicked">
			</vue-simple-context-menu> 
      <v-container>
        <v-row>
        <v-col>  <drag v-for="n in numbers" :key="n" class="drag" :data="n" go-back>{{n}}</drag>
            <!--   <v-card class="mx-auto" max-width="500">
              Not Empty
              <v-card-text>
                <v-treeview
                  :items="notEmptyItems"
                  :filter="filter"
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
          </v-col> 
          <v-divider vertical></v-divider>
          <v-col class="pa-6" cols="6">
            <template>
              <v-card class="mx-auto" max-width="500">                     <drop class="main" @drop="onDrop">
                                       <v-icon>mdi-code-json</v-icon>
                      </drop>
                only Empty
                <!-- <v-card-text>

                  <v-treeview
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
                        v-if="CanTarget(item)"
                        class="cut"
                        @drop="onDrop"
                        mode="cut"
                      >
                        <v-icon>
                          {{ getIcon(item, open) }}
                        </v-icon>
                      </drop>
                      <v-icon v-else>
                        {{ getIcon(item, open) }}
                      </v-icon>
                      <div v-if="item.Content.length > 0">
                        <v-icon> mdi-code-json </v-icon>
                        count= {{ item.Content.length }}
                      </div>
                    </template>
                  </v-treeview>
                </v-card-text> -->
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
import VueSimpleContextMenu from 'vue-simple-context-menu'
export default {
  name: "App",
  components: {
    Drag,
    DropList,
    Drop,
    VueSimpleContextMenu
  },

  data: () => ({
 numbers: [1, 2, 3, 4, 5],
      dropped: [],
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
						name: 'Delete',
						slug: 'delete'
					}
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
    console.log('s');
      this.dropped.push(e.data);
    },
    SonDrop(s, e) {
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
    onDrop(e) {
      this.displaced.push(e.data);
    },
    onInsert(event) {
      this.displaced.splice(event.index, 0, event.data);
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

.cut {
  margin: 20px 10px;
  border: 1px solid black;
  height: 100px;
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
		margin: 0,0;
		padding: 0,0;
		display: none;
		list-style: none;
		position: absolute;
		z-index: 1000000;
		background-color: white;
		border-bottom-width: 0px;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
		box-shadow: 10px 3px 6px 0 rgba(0,0,0, 0.4);
		border-radius: 2px;
	}

	.vue-simple-context-menu--active {
		display: block;
	}

	.vue-simple-context-menu__item {
		display: flex;
		color: black;
		cursor: pointer;
		padding: 13px,6px;
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

</style>
