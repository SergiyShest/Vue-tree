<template>
<div>
  

    <v-card class="mx-auto" max-width="500" max-height="1000">
       <vue-simple-context-menu
      :elementId="'myContextMenu'"
      :options="contextMenuItems"
      :ref="'contextMenu'"
      @option-clicked="contextMenuClicked"
    > </vue-simple-context-menu>
    <v-card-title>
      <v-row justify="space-between" align="center">
        {{ title }}
        <v-checkbox
          v-model="openAll"
          v-on:change="openFilledChanged"
          label="open all"
        />
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-treeview
        style="height: 800px; overflow-y: auto"
        :items="items"
        activatable
        item-key="Id"
        ref="treeView"
        open-on-click
      >
        <template v-slot:prepend="{ item, open }">
        <v-row style="align-items:center" 						 > 
							<div  	>
								<drag v-if="CanMove(item)" 
                    @contextmenu.prevent.stop="handleContextMenu($event, item)"
									  class="dragCl"
									  :data="item"
									  key="item.Id"
									  @cut="removeContent(item)">
									<img :src="require('@/assets/images/' + getSrc(item, open))"
										 height="32px"
										 width="32px" />

								</drag>
								<div v-else @contextmenu.prevent.stop="handleContextMenu($event, item)" >
									<drop :id="item.Id"
										  v-if="CanBeDropTarget(item)"
										  class="dropCl"
										  @drop="onDrop($event, item)"
										  mode="cut">
										<img :src="require('@/assets/images/' + getSrc(item, open))"
											 height="32px"
											 width="32px" />
										<div v-if="item.Content.length > 0">
											<v-icon> mdi-code-json </v-icon>
										</div>
									</drop>

									<img v-else
										 :src="require('@/assets/images/' + getSrc(item, open))"
										 height="32px"
										 width="32px" />
								</div>
							</div>
							<div style="margin-left:3px;  font-weight :bold">{{item.Name}}</div>
							<div v-if="item.Content.length>0">-->{{item.Content.length}}</div>
						</v-row>
        </template>
      </v-treeview>
    </v-card-text>
  </v-card>
  </div>
</template>

<script>
import { Drag, Drop, DropList } from "vue-easy-dnd";
import VueSimpleContextMenu from "vue-simple-context-menu";
export default {
  name: "treeView",
  components: {
    Drag,
    DropList,
    Drop,
    VueSimpleContextMenu,
  },
  props: ["items", "title"],
  data: () => ({
    searchText: null,
    search: null,
    barkodeSearch: true,
    displaced: [],
    selection: [],
    openAll: false,

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

  methods: {
    openFilledChanged() {
      this.$refs.treeView.updateAll(this.openAll);
    },
    handleContextMenu(event, item) {
      console.log(event);
      console.log('pageX='+event.pageX);
      console.log('clientX='+event.clientX);
      console.log('screenX='+event.screenX); 
      console.log('x='+event.x); 
      console.log('offsetX='+event.offsetX);                  

      this.$refs.contextMenu.showMenu(event, item);
     
 //     console.log('tree.offsetLeft'+tree.offsetLeft);   
 //     menu.style.left = event.pageX-menu.parentElement.offsetLeft - 2 + "px";
//      console.log('menu.style.left='+menu.style.left);        
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

    CanMove(item) {
      if (item) {
        if (/Shelf/.test(item.name)) {
          return this.HasContent(item);
        }
      }
      return false;
    },
    CanBeDropTarget(item) {
      if (item) {
        if (/Shelf/.test(item.name)) {
          return !this.HasContent(item);
        }
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
    Search() {
      console.log("ddd");
      this.open = this.selection;
    },
  },
  mounted: function () {
     var menu = document.getElementById('myContextMenu');
      document.firstElementChild.appendChild(menu);       
  },
};
</script>
<style>
html,
body {
  height: 100%;
  font-family: "Roboto";
}

.dragCl {
  width: 30px;
  height: 30px;
  background-color: rgb(240, 220, 255);
  display: inline-flex;
  align-items: left;
  justify-content: left;
  margin: 10px 10px 0 10px;
  font-size: 20px;
  transition: all 0.5s;
}

.dropCl {
  margin: 20px 10px;

  width: 30px;
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
  left: 0px;
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
  margin-left: 10px;
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
