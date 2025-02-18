<template>
  <!-- feedback zone. I'm not fan of toasters, but can adapt -->
  <div id="feedback" :class="msgMode">{{ message || "&nbsp;" }}</div>

  <!-- got data ? let's push headers -->
  <div id="cargoList" v-if="shipments.shipments.value?.length">
    <div class="listHeader">Vessel</div>
    <div class="listHeader">Customer</div>
    <div class="listHeader">ETA</div>
    <div class="listHeader"></div>

    <template v-for="shipment in shipments.shipments.value" :key="shipment.id">
      <!-- sub component for update life cycle and factorisation. No chance to use v-memo here -->
      <ShipmentRow :shipment="shipment" @msg="handleMessage"></ShipmentRow>
    </template>
  </div>

  <!-- shipments are null as long as we didn't try any API call on the list -->
  <div v-else-if="shipments.shipments === null">
    <img src="@/assets/loading.svg" height="48" alt="loading" />
  </div>

  <!-- shipments are undefined if the API call failed -->
  <div v-else-if="shipments.shipments === undefined">
    <div class="not-found">
      Failed loading data from server
    </div>
  </div>

  <!-- API call provided an empty list -->
  <div v-else>
    <div class="not-found">
      No shipment has been found
    </div>
    <div>♫ there's no slot</div>
    <div>in this cargoplot ♪</div>
  </div>
</template>

<!---------------------------------------------------------------->
<script setup lang="ts">
import { ref } from "vue";
import { useShipments } from "@/stores/shipments.ts";
import ShipmentRow from "@/components/ShipmentRow.vue";

const shipments = useShipments;

const message = ref("");
const msgMode = ref("success");

const handleMessage = (
  severity: "success" | "error" | undefined,
  detail: string
) => {
  message.value = detail;
  if (severity) msgMode.value = severity;
};

// filling the list on loading
shipments.callShipments();
</script>

<!---------------------------------------------------------------->
<style>
#cargoList {
  display: grid;
  grid-template-columns: 1fr 1fr 150px 200px;
}

#cargoList > div {
  padding: 0.5rem 1rem;
  margin: 2px;
  border-radius: 0.2rem;
  display: flex;
  align-items: center;
}

#cargoList > div:nth-child(4n),
#cargoList > div:nth-child(4n-1) {
  justify-content: center;
}

#cargoList > div:nth-child(8n + 9),
#cargoList > div:nth-child(8n + 10),
#cargoList > div:nth-child(8n + 11),
#cargoList > div:nth-child(8n + 12) {
  background-color: var(--vt-c-grey);
}
</style>

<style scoped>
#feedback {
  padding: 0.5rem 1rem;
}

.listHeader {
  background-color: var(--vt-c-darker-grey);
}

.not-found {
  color: var(--vt-c-red);
  margin-bottom: 1rem;
}
</style>
