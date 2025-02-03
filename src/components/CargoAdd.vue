<template>
  <CargoAddPopup class="addPopup" ref="addPopup"></CargoAddPopup>

  <div id="shipmentAdd">
    <button
      id="cargoAddButton"
      type="button"
      @click="showCargoAddForm()"
      :disabled="shipments.shipments === null"
    >
      Add a shipment
    </button>
  </div>
</template>

<!---------------------------------------------------------------->
<script setup lang="ts">
import { ref } from "vue";
import CargoAddPopup from "@/components/CargoAddPopup.vue";
import { useShipments } from "@/stores/shipments.ts";

const addPopup = ref();

const shipments = useShipments;

const showCargoAddForm = () => {
  addPopup.value.showCargoAdd();
};
</script>

<!---------------------------------------------------------------->
<style scoped>
#shipmentAdd {
  text-align: right;
}
</style>
