<template>
	<fieldset style="margin-top:10px;margin-bottom:10px;padding-left:10px;border-color:#EEE;border-radius:5px"  >
		<legend>  {{header}}</legend>
		<!--<v-card class="c-flex" style="margin-top:10px;margin-bottom:10px;padding-left:10px" >
		<v-system-bar color="#EEE" style="font-weight: bold ;margin-bottom:10px">
		  {{ header }} <v-spacer />
			  </v-system-bar>
			  </v-card>-->
	</fieldset>
</template>

<script>
	export default {
		name: "formGroup",
		props: ["header"],
	};
</script> 