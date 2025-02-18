import { vessels } from '@/utils/vessels.ts'
import { ref } from 'vue'

export const useVesselsETA = {
  vesselsETA: ref(
    vessels.map((vessel) => ({ name: vessel, ETA: null })) as {
      name: string
      ETA: Date | null
    }[],
  ),

  getVesselETA: (vesselName: string | null) => {
    return useVesselsETA.vesselsETA.value.find((vesselETA) => vesselETA.name === vesselName)?.ETA
  },

  checkVesselETA: async (vesselName: string | null) => {
    if (vesselName?.length) {
      const currentVesselETA = useVesselsETA.vesselsETA.value.find(
        (vesselETA) => vesselETA.name === vesselName,
      )

      await fetch(import.meta.env.VITE_BACKEND_URL + '/vessel/' + vesselName)
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
}
