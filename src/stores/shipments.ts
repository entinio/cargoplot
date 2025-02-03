import { Shipment } from '@/classes/Shipment.ts'
import { ref } from 'vue'

export const useShipments = ref({
  shipments: null as Shipment[] | null | undefined,

  // both functions addOneShipment() and addShipments() could be merged, but I wanted an explicit name when calling
  addOneShipment: (shipment: Shipment) => {
    if (useShipments.value.shipments) useShipments.value.shipments.push(shipment)
  },

  addShipments: (shipments: Shipment[]) => {
    if (useShipments.value.shipments) useShipments.value.shipments.push(...shipments)
  },

  /* initialize shipments list from server side */
  callShipments: async () => {
    fetch('http://localhost:9898/shipment')
      .then((res) => res.json())
      .then((response) => {
        if (response) {
          // might check schema before assigning
          useShipments.value.shipments = response.sort((a: Shipment, b: Shipment) => a.id - b.id)
        } else useShipments.value.shipments = []
      })
      .catch((error) => {
        // we might definitely need some error hub here
        // but limited myself to some hours on that test
        useShipments.value.shipments = undefined
        console.log(error)
      })
  },

  /* change ETA for a specified cargo id on server + client sides */
  setShipmentETA: async (shipment: Shipment, ETA: Date) => {
    fetch('http://localhost:9898/shipment/' + shipment.id, {
      method: 'PUT',
      body: JSON.stringify(Object.assign({ ...shipment }, { 'shipment-eta': ETA })),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response && useShipments.value.shipments) {
          const currentShipment = useShipments.value.shipments.find((s) => s.id === shipment.id)

          if (currentShipment) currentShipment['shipment-eta'] = ETA
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },
})
