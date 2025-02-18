<template>
  <template v-if="props.shipment">
    <div>{{ props.shipment.vessel }}</div>

    <div>{{ props.shipment.customer }}</div>

    <div
      class="ETAcell"
      :class="ETAisSynced(props.shipment as Shipment) ? 'ETAok' : ''"
    >
      <div>{{ props.shipment["shipment-eta"] }}</div>
      <div v-if="ETAneedsToBeUpdated(props.shipment as Shipment)">
        {{ vesselsETA.getVesselETA(props.shipment.vessel) }}
      </div>
    </div>

    <!-- buttons overlap for some easy UX to my taste, but can easily make both buttons available. Will depend on your preference ! -->
    <div class="cargoButtons">
      <button
        type="button"
        @click="updateETA(props.shipment as Shipment)"
        :disabled="checkButtonsDisabled"
        v-if="ETAneedsToBeUpdated(props.shipment as Shipment)"
      >
        Update ETA
      </button>

      <button
        @click="checkETA(props.shipment.vessel)"
        :disabled="checkButtonsDisabled"
        v-else
      >
        Check ETA
      </button>
    </div>
  </template>
</template>

<!---------------------------------------------------------------->
<script setup lang="ts">
import { ref } from "vue";
import { Shipment } from "@/classes/Shipment.ts";
import { useVesselsETA } from "@/stores/vesselsETA.ts";
import { useShipments } from "@/stores/shipments.ts";

const props = defineProps({
  shipment: Object as () => Shipment
});

const emit = defineEmits<{
  (e: "msg", severity: "error" | "success" | undefined, detail: string): void;
}>();

const vesselsETA = useVesselsETA;
const shipments = useShipments;

const checkButtonsDisabled = ref(false);

// existing and unsynced ETA ?
const ETAneedsToBeUpdated = (shipment: Shipment) => {
  return (
    shipment["shipment-eta"] !== vesselsETA.getVesselETA(shipment.vessel) &&
    vesselsETA.getVesselETA(shipment.vessel)
  );
};

// existing and synced ETA ?
const ETAisSynced = (shipment: Shipment) => {
  return (
    shipment["shipment-eta"] === vesselsETA.getVesselETA(shipment.vessel) &&
    vesselsETA.getVesselETA(shipment.vessel)
  );
};

const checkETA = (vessel: string | null) => {
  checkButtonsDisabled.value = true;

  vesselsETA
    .checkVesselETA(vessel)
    .then(() => {
      emit("msg", "success", "ETA state for " + vessel + " has been checked");
    })
    .catch(error => {
      emit("msg", "error", error.message);
    });

  checkButtonsDisabled.value = false;
};

const updateETA = (shipment: Shipment) => {
  checkButtonsDisabled.value = true;

  const ETA = vesselsETA.getVesselETA(shipment.vessel);

  if (ETA)
    shipments
      .setShipmentETA(shipment, ETA)
      .then(() => {
        emit(
          "msg",
          "success",
          shipment.vessel +
            " ETA for " +
            shipment.customer +
            " has been updated to " +
            ETA +
            " successfully"
        );
      })
      .catch(error => {
        emit("msg", "error", error.message);
      });

  checkButtonsDisabled.value = false;
};
</script>

<!---------------------------------------------------------------->
<style scoped>
.ETAcell {
  display: flex;
  flex-direction: column;
}

.ETAcell > div:nth-child(2n) {
  color: var(--vt-c-red);
}

.cargoButtons > button {
  min-width: 150px;
}

.ETAok {
  color: var(--vt-c-green);
}
</style>
