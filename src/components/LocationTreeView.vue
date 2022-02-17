<template>
  <div>
    <vue-simple-context-menu
      :elementId="contentMenuId"
      :options="contextMenuItems"
      :ref="'contextMenu'"
      @option-clicked="contextMenuClicked"
    >
    </vue-simple-context-menu>

    <v-dialog v-model="addNodeDialog" width="400">
      <v-card raised style="padding: 5px; border: 4px double black">
        <v-card-title class="headline"
          >Add Node for "{{ ParentNodeName }}"</v-card-title
        >
        <v-text-field
          v-model="newNodeName"
          label="Input name pleace"
          outlined
          dense
        ></v-text-field>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="greey darken-1" @click="AddNewNode()">Ok</v-btn>
          <v-btn color="greey darken-1" @click.native="addNodeDialog = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="renameDialog" width="400">
      <v-card raised style="padding: 5px; border: 4px double black">
        <v-card-title class="headline">Rename </v-card-title>
        <v-text-field
          v-model="newNodeName"
          label="Rename name pleace"
          outlined
          dense
        ></v-text-field>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="greey darken-1" @click="Rename()">Ok</v-btn>
          <v-btn color="greey darken-1" @click.native="renameDialog = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-subtitle>
        <v-col>
          <v-row
            justify="space-between"
            align="center"
            style="
              background-color: linear-gradient(
                #33ccff 0%,
                #ff99cc 100%
              ) !important;
            "
          >
            {{ title }}
            <v-checkbox
              v-model="onlyEmpty"
              v-on:change="onlyEmptyChanged"
              label="only empty"
            />
            <v-checkbox
              v-model="onlyFilled"
              v-on:change="onlyFilledChanged"
              label="only filled"
            />
            <v-checkbox
              v-model="openAll"
              v-on:change="openAllChanged"
              label="open all"
            />
          </v-row>
          <v-text-field
            v-model="filterString"
            outlined
            label="filter by location name"
          />
        </v-col>
      </v-card-subtitle>
      <v-card-text>
        <div class="text" v-if="dragInProgress">Drag in progress :</div>
        <v-treeview
          style="height: 80vh; overflow-y: auto"
          :items="filtredItems"
          activatable
          item-key="Id"
          ref="treeView"
          open-on-click
        >
          <template v-slot:prepend="{ item, open }">
            <v-row style="align-items: center">
              <div style="margin-right: 3px; font-weight: bold">
                {{ item.Id }}
              </div>
              <div>
                <drag
                  v-if="CanMove(item)"
                  @contextmenu.prevent.stop="handleContextMenu($event, item)"
                  class="dragCl"
                  :data="item"
                  key="item.Id"
                >
                  <img
                    :src="require('@/assets/images/' + getSrc(item, open))"
                    height="32px"
                    width="32px"
                  />
                </drag>
                <div
                  v-else
                  @contextmenu.prevent.stop="handleContextMenu($event, item)"
                >
                  <drop
                    :id="item.Id"
                    v-if="CanBeDropTarget(item)"
                    class="dropCl"
                    @drop="onDrop($event, item)"
                  >
                    <img
                      :src="require('@/assets/images/' + getSrc(item, open))"
                      height="32px"
                      width="32px"
                    />
                  </drop>
                  <img
                    v-else
                    :src="require('@/assets/images/' + getSrc(item, open))"
                    height="32px"
                    width="32px"
                  />
                </div>
              </div>
              <div style="margin-left: 3px; font-weight: bold">
                {{ item.Name }}
              </div>
              <div v-if="item.AllContentCount > 0">
                -->{{ item.AllContentCount }}
              </div>
            </v-row>
          </template>
        </v-treeview>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
const varName = "jjj";
import { Drag, Drop, DragAwareMixin } from "vue-easy-dnd";
import VueSimpleContextMenu from "vue-simple-context-menu";
import { baseMixin } from "./BaseMixin.js";
import {
  getEmptyTree,
  getFilledTree,
  getFiltredTree,
  generateGuid,
} from "./ArrayFunctions.js";
export default {
  mixins: [baseMixin, DragAwareMixin],
  name: "LocationTreeView",
  components: {
    Drag,
    Drop,
    VueSimpleContextMenu,
  },
  props: [
    "treeNum",
    "initialTree",
    "title"
  ],
  data: () => ({
    ParentNodeName: "",
    newNodeName: "",
    editItem: null,
    addNodeDialog: false,
    renameDialog: false,
    locationSource: null,
    locationTarget: null,
    openAll: false,
    contentMenuId: generateGuid(),
    contextMenuItems: [],
    filterString: "",
    onlyEmpty: false,
    onlyFilled: false,
  }),
  computed: {
    // onlyEmpty:
    // {
    //   get:function () {
    //       var savedVal= localStorage.getItem('onlyEmpty'+this.treeNum);
    //       if(savedVal!=null)return savedVal;
    //       return this.intitalOnlyEmpty;
    //   },
    //   set:function (newValue) {

    //       localStorage.getItem('onlyEmpty'+this.treeNum,newValue);
    //   }
    // },
    // onlyFilled:
    // {
    //   get:function () {
    //       var savedVal= localStorage.getItem('onlyFilled'+this.treeNum);
    //       if(savedVal!=null)return savedVal;
    //       return this.intitalOnlyFilled;
    //   },
    //   set:function (newValue) {
    //       localStorage.getItem('onlyFilled'+this.treeNum,newValue);
    //   }
    // }
    //   ,
    RecommendedNodeName() {
      if (this.editItem) {
        if (this.editItem.Code == "FREEZER") {
          return "Shelf ";
        }

        if (this.editItem.Code == "SHELF") {
          return "Rack ";
        }
        if (this.editItem.Code == "RACK") {
          return "Row ";
        }
      }
      return "new node name";
    },
    filtredItems() {
      if (!this.initialTree.Name) return [];
      let _tree = this.initialTree;

      if (this.onlyEmpty) {
        _tree = getEmptyTree(this.initialTree);
      }
      if (this.onlyFilled) {
        _tree = getFilledTree(this.initialTree);
      }
      let filtred = _tree.children;
      if (this.filterString) {
        localStorage.setItem("filterString" + this.treeNum, this.filterString);
        filtred = getFiltredTree(_tree.children, this.filterString);
        this.$nextTick(function () {
          this.$refs.treeView.updateAll(true);
         });
      }
      return filtred;
    },
  },
  methods: {
    onlyEmptyChanged() {
      if (this.onlyEmpty) this.onlyFilled = false;
      //localStorage.setItem("onlyEmpty" + this.treeNum, this.onlyEmpty);
    },
    onlyFilledChanged() {
      if (this.onlyFilled) this.onlyEmpty = false;
      //localStorage.setItem("onlyFilled" + this.treeNum, this.onlyFilled);
    },
    openAllChanged() {
      this.$refs.treeView.updateAll(this.openAll);
    },
    handleContextMenu(event, item) {
      this.$refs.contextMenu.options = this.GetContextMenuItems(item);

      this.$refs.contextMenu.showMenu(event, item);
    },
    // getting a menu depending on the item that is selected
    GetContextMenuItems(item) {
      let options = [];
      if (this.HasContent(item)) {
        options.push({ name: "Clear all samples", slug: "clear" });
        options.push({ name: "Show all samples", slug: "showSamples" });
      }
      if (item.Code == "ROW") {
        options.push({ name: "Add samples", slug: "addSamples" });
      }
      if (item.Code == "FREEZER") {
        options.push({ name: "Add Shelf", slug: "addChaild" });
      }
      if (item.Code == "SHELF") {
        options.push({ name: "Add Rack", slug: "addChaild" });
      }
      if (item.Code == "RACK") {
        options.push({ name: "Add ROW", slug: "addChaild" });
      }
      options.push({ name: "Rename", slug: "rename" });

      return options;
    },
    contextMenuClicked(event) {
      switch (event.option.slug) {
        case "clear":
          var cl = this.clear;
          dxConfirm(
            'Are you sure to remove samples inside "' + event.item.Name + '"?'
          ).success(function () {
            cl(event.item);
          });
          break;
        case "showSamples":
          //function placed in Index.cshtml
          ShowSamples(event.item);
          break;
        case "addSamples":
          //function placed in Index.cshtml
          AddSamples(event.item);
          break;
        case "addChaild":
          this.ShowAddChaildDialog(event.item);
          break;
        case "rename":
          this.ShowRenameDialog(event.item);
          break;
      }
    },
    //get part of image
    getSrc(item, empty) {
      var img = "folder.png";

      if (item.Code == "FREEZER") img = "refrigerator.png";
      if (item.Code == "SHELF") {
        if (this.HasContent(item)) {
          img = "shelf.png";
        } else {
          img = "shelfEmpty.png";
        }
      }
      if (item.Code == "ROOM") img = "room.png";
      if (item.Code == "RACK") img = "Rows.png";
      if (item.Code == "ROW") img = "row.png";
      return img;
    },
    clear(item) {
      this.fetch(this.ok, "/Location/EditLocation/Clear?locationId=" + item.Id);
    },
    ShowAddChaildDialog(item) {
      this.editItem = item;
      this.ParentNodeName = this.editItem.Name;
      this.newNodeName = this.RecommendedNodeName;
      this.addNodeDialog = true;
    },
    AddNewNode() {
      this.addNodeDialog = false;
      this.fetch(
        this.ok,
        "/Location/EditLocation/addChaild?locationId=" +
          this.editItem.Id +
          "&name=" +
          this.newNodeName
      );
    },
    ShowRenameDialog(item) {
      this.editItem = item;
      this.newNodeName = this.editItem.Name;
      this.renameDialog = true;
    },
    Rename() {
      this.renameDialog = false;
      this.fetch(
        this.ok,
        "/Location/EditLocation/Rename?locationId=" +
          this.editItem.Id +
          "&name=" +
          this.newNodeName
      );
    },
    ok(item) {
      this.editItem = null;
      if (item.Errors) {
        this.ShowErrors(val);
      } else {
        this.$emit("refresh");
      }
      if (item.Item) {
        this.ShowAlert(item.Item);
      }
    },
    CanMove(item) {
      if (item) {
        if (item.Code == "ROW" || item.Code == "RACK" || item.Code == "SHELF") {
          var s = this.HasContent(item);
          //						if(s) console.log(item.Name)
          return s;
        }
        return false;
      }
      return false;
    },
    CanBeDropTarget(item) {
      if (this.dragInProgress)
        if (item) {
          if (this.dragData.Code == "SHELF" && item.Code == "FREEZER") {
            return true;
          }
          if (this.dragData.Code == "RACK" && item.Code == "SHELF") {
            return true;
          }
          if (this.dragData.Code == "ROW" && item.Code == "RACK") {
            return true;
          }
        }
      return false;
    },
    onDrop(e, item) {
      this.fetch(
        this.ok,
        "/Location/EditLocation/Drop?targetLocationId=" +
          item.Id +
          "&sourceLocationId=" +
          e.data.Id
      );
    },
    changeLocation() {},
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
  },
  mounted: function () {
    window.globalEvent.$on(varName, (locationId, ids) => {
      this.fetch(
        this.ok,
        "/Location/EditLocation/AddSamples?locationId=" +
          locationId +
          "&ids=" +
          ids
      );
    });
    //replace menu in visual root
    var menu = document.getElementById(this.contentMenuId);
    document.firstElementChild.appendChild(menu);

    // var savedVal = localStorage.getItem("onlyEmpty" + this.treeNum);
    // if (savedVal != null) {
    //   this.onlyEmpty = savedVal;
    // } else {
    //   this.onlyEmpty = this.intitalOnlyEmpty;
    // }
    //  savedVal = localStorage.getItem("onlyFilled" + this.treeNum);
    // if (savedVal != null) {
    //   this.onlyFilled = savedVal;
    // } else {
    //   this.onlyFilled = this.intitalOnlyFilled;
    // }
    var savedVal = localStorage.getItem("filterString" + this.treeNum);
    if (savedVal != null) {
      this.filterString = savedVal;
    }
  },
};
</script>
<style>
.dragCl {
  width: 40px;
  height: 30px;
  background-color: rgb(200, 220, 255);
  display: inline-flex;
  align-items: left;
  justify-content: left;
  margin: 10px 10px 0 10px;
  font-size: 20px;
  transition: all 0.5s;
}

.dropCl {
  margin: 20px 10px;
  width: 40px;
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
  box-shadow: 0 1 15px rgba(0, 0, 255, 0.4);
  background-color: rgba(8, 250, 8, 0.8);
}

/* .list-enter,
.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  position: absolute;
} */

.vue-simple-context-menu {
  top: 0;
  left: 0;
  margin: 0, 0;
  padding: 0, 0;
  display: none;
  list-style: none;
  position: absolute;
  z-index: 1000000;
  background-color: rgb(202, 210, 212);
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
  height: 25px;
  cursor: pointer;
  padding: 3px, 6px;
  margin-left: 5px;
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

/* .v-text-field--box .v-input__control .v-input__slot,
.v-text-field--outline .v-input__control .v-input__slot,
.v-text-field .v-input__control .v-input__slot {
  min-height: 25px;
  display: flex !important;
  align-items: center !important;
  margin: 2px;
} */
</style>
