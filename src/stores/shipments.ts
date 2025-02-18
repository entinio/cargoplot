import { Shipment } from '@/classes/Shipment.ts'
import { ref } from 'vue'

export const useShipments = {
  shipments: ref(null as Shipment[] | null | undefined),

  addShipment: async (shipment: Shipment) => {
    fetch(import.meta.env.VITE_BACKEND_URL + '/shipment', {
      method: 'POST',
      body: JSON.stringify(shipment),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response)
        if (useShipments.shipments.value) useShipments.shipments.value.push(response)
      })
  },

  addShipments: (shipments: Shipment[]) => {
    if (useShipments.shipments.value) useShipments.shipments.value.push(...shipments)
  },

  /* initialize shipments list from server side */
  callShipments: async () => {
    fetch(import.meta.env.VITE_BACKEND_URL + '/shipment')
      .then((res) => res.json())
      .then((response) => {
        if (response) {
          // might check schema before assigning
          useShipments.shipments.value = response.sort((a: Shipment, b: Shipment) => a.id - b.id)
        } else useShipments.shipments.value = []
      })
      .catch((error) => {
        // we might definitely need some error hub here
        // but limited myself to some hours on that test
        useShipments.shipments.value = undefined
        console.log(error)
      })
  },

  /* change ETA for a specified cargo id on server + client sides */
  setShipmentETA: async (shipment: Shipment, ETA: Date) => {
    fetch(import.meta.env.VITE_BACKEND_URL + '/shipment/' + shipment.id, {
      method: 'PUT',
      body: JSON.stringify(Object.assign({ ...shipment }, { 'shipment-eta': ETA })),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response && useShipments.shipments.value) {
          const currentShipment = useShipments.shipments.value.find((s) => s.id === shipment.id)

          if (currentShipment) currentShipment['shipment-eta'] = ETA
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },
}
