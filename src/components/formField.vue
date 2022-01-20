<template>
  <v-row no-gutters  >
    <v-col cols="3" class="d-flex justify-start align-center" >
      <v-label   >{{ property.Text }}:</v-label>
    </v-col >
	<v-col cols="8" class="shrink">
		<v-text-field v-if="property.ControlType == 'TextField'" elevation="1"
					  :class="CssClass"
					  :type="property.DataType"
					  v-model="property.Value"
					  :readonly="property.Readonly"
					  :placeholder="property.Description"
					  outlined
					  hide-details="auto"
					  :rules="property.Rules"
					  :background-color="BackgroundColor" />
		<div v-if="property.ControlType == 'ComboBox'">

			<v-combobox v-model="SelectedObject"
						:items="property.AvaiableValues"
						item-text="Name"
						item-value="Id"
						clearable
                        
						:placeholder="property.Description"
						outlined
						hide-details="auto"
						:rules="property.Rules" 
						:background-color="BackgroundColor" />
		</div>
		<v-row v-if="property.ControlType == 'TextFieldWithButtonSerch'"  class="d-flex justify-start align-center"  >
			<v-select   v-model="property.Value" style="margin:8px;margin-left:12px"
						:items="property.AvaiableValues"
						item-text="Name"
						item-value="Id"
						clearable readonly
						:placeholder="property.Description"
						outlined
						hide-details="auto"
						:rules="property.Rules"
						:background-color="BackgroundColor" />
			<v-btn v-on:click="say(property.Value)" >...</v-btn>
		</v-row>                       
	</v-col>
  </v-row>
</template>
,
<script>

	export default {
		name: "fromField",
		props: ["CssClass", "property"],
		data: () => ({
			dataType: "date",
			selectedId: null,
			SelectedObject:null
		}),
		computed: {
			BackgroundColor: function () {
				if (this.property.Readonly) {
					return "#CCC";
				}
				return this.property.IsChanged ? "#FFF" : "#EEE";
			},
		},
		watch: {
			SelectedObject: function () {

				this.property.Value = this.SelectedObject.Id;
			},
		},
		metods: {
			say (message) {
				alert(message)
			},
			selectitemdialog() {
				console.log('ara')
				alert('ara')
			}
			,
			FindItem(path) {

				ShowUrlPopup("Select item",
					path,
					document.documentElement.clientWidth - 150);

			}

		}
		,
		mounted: function () {
			console.log('------------------------------------------'+this.property.ControlType);
			if (this.property.AvaiableValues) {
				console.log(this.property.AvaiableValues.length);
				for (let i = 0; i < this.property.AvaiableValues.length; i++) {
					var item = this.property.AvaiableValues[i]
					if (item.Id == this.property.Value) {
						this.SelectedObject = item; break;
					}
				}
				
			}
			
		}
	}
</script>
