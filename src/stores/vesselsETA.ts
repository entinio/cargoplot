import { vessels } from '@/utils/vessels.ts'
import { ref } from 'vue'

export const useVesselsETA = ref({
  vesselsETA: vessels.map((vessel) => ({ name: vessel, ETA: null })) as {
    name: string
    ETA: Date | null
  }[],

  getVesselETA: (vesselName: string | null) => {
    return useVesselsETA.value.vesselsETA.find((vesselETA) => vesselETA.name === vesselName)?.ETA
  },

  checkVesselETA: async (vesselName: string | null) => {
    if (vesselName?.length) {
      const currentVesselETA = useVesselsETA.value.vesselsETA.find(
        (vesselETA) => vesselETA.name === vesselName,
      )

      await fetch('http://localhost:9898/vessel/' + vesselName)
        .then((res) => res.json())
        .then((response) => {
          if (response) {
            if (currentVesselETA) currentVesselETA.ETA = response['vessel-eta']
          }
        })
        .catch((error) => {
          console.log(error)
        })

      if (currentVesselETA?.ETA) return Promise.resolve(currentVesselETA.ETA)
      else Promise.reject(new Error('no ETA'))
    }

    Promise.reject(new Error('no vessel'))
  },
})
