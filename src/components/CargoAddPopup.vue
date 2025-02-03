<template>
  <Overlay :visible="popVisible" @click="popVisible = false">
    <div class="pop" @click.prevent.stop>
      <h2>Add a Cargo</h2>

      <form id="cargoForm" @submit.prevent>
        <div>
          <label for="cargoCustomer">
            Customer *
          </label>
          <input
            type="text"
            id="cargoCustomer"
            v-model="currentCargo.customer"
            placeholder="Cargo customer"
          />
        </div>

        <div>
          <label for="cargoVessel">
            Vessel *
          </label>
          <select v-model="currentCargo.vessel" @change="updateETAField()">
            <option
              v-for="(vessel, index) in vessels"
              :value="vessel"
              :key="index"
            >
              {{ vessel }}
            </option>
          </select>
        </div>

        <!--
          I wasn't sure if you need to be able to modify the current ETA state from the server 
          so I still offered a possibility to modify that value before posting
          I'd chain the API calls if not
         -->
        <div>
          <label for="cargoETA">
            ETA *
          </label>
          <input
            type="date"
            id="cargoETA"
            v-model="currentCargo['shipment-eta']"
            :disabled="disabled"
          />
        </div>

        <div class="error">{{ errors[errorCode] || errorMsg || "&nbsp;" }}</div>

        <div>
          <button @click="popVisible = false">Cancel</button>
          <button type="button" @click="cargoAdd()" :disabled="disabled">
            Add
          </button>
        </div>
      </form>
    </div>
  </Overlay>
</template>

<!---------------------------------------------------------------->
<script setup lang="ts">
import { ref } from "vue";
import Overlay from "@/components/OverLay.vue";
import { useShipments } from "@/stores/shipments.ts";
import { useVesselsETA } from "@/stores/vesselsETA.ts";
import { Shipment } from "@/classes/Shipment.ts";
import { vessels } from "@/utils/vessels.ts";

const shipments = useShipments;
const vesselsETA = useVesselsETA;

const popVisible = ref(false);

const currentCargo = ref(new Shipment());

const errorCode = ref(0);
const errorMsg = ref("");

const disabled = ref(false);

// that part would most likely end up in some i18n lang directory
// but I avoided using any library on this little project
// would still be smart to regroup all texts within some texts/* file, but let texts within on that test
const errors = [
  "",
  "Please input a customer",
  "Please pick a vessel",
  "Please input a customer and pick a vessel",
  "Please choose an ETA",
  "Please input a customer and choose an ETA",
  "Please input a customer and pick a vessel",
  "Please fill all fields"
];

// notice that updating ETA here will also change ETA states in the list through the store
const updateETAField = async () => {
  disabled.value = true;

  const newETA = await vesselsETA.value
    .checkVesselETA(currentCargo.value.vessel)
    .catch(() => {
      disabled.value = false;
    });

  if (newETA) currentCargo.value["shipment-eta"] = newETA;

  disabled.value = false;
};

// could be smart to push the API call to stores/shipments
// but there's some technical considerations about doing so
// let it within the component for this test
const cargoAdd = () => {
  // form validation
  if (currentCargo.value.customer?.length) errorCode.value = 0;
  else errorCode.value = 1;
  if (!currentCargo.value.vessel?.length) errorCode.value += 2;
  if (currentCargo.value["shipment-eta"] === null) errorCode.value += 4;

  // API call
  if (!errorCode.value) {
    disabled.value = true;

    fetch("http://localhost:9898/shipment", {
      method: "POST",
      body: JSON.stringify(currentCargo.value)
    })
      .then(res => res.json())
      .then(response => {
        shipments.value.addOneShipment(response);
        popVisible.value = false;
      })
      .catch(error => {
        errorMsg.value = error.message;
      });

    disabled.value = false;
  }
};

const showCargoAdd = () => {
  currentCargo.value.customer = "";
  currentCargo.value.vessel = null;
  currentCargo.value["shipment-eta"] = null;
  errorMsg.value = "";
  popVisible.value = true;
};

defineExpose({
  showCargoAdd
});
</script>

<!---------------------------------------------------------------->
<style scoped>
.pop {
  overflow: auto;
  max-height: 100vh;
  padding: 2rem;
  margin-bottom: 2rem;
  background-color: var(--vt-c-lightgrey);
  border-radius: 2rem;
  box-shadow: rgba(95, 116, 141, 0.03) 0px 2px 1px -1px,
    rgba(95, 116, 141, 0.04) 0px 1px 1px 0px,
    rgba(95, 116, 141, 0.08) 0px 1px 3px 0px;
  z-index: 1334;
}
</style>
