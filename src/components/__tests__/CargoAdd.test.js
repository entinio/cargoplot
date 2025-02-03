import { test, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import CargoAdd from '../CargoAdd.vue'

/*
  wrote only this little test to show I can write somes
  but to be honest, that would require a lot few more hours to cover all edge cases
*/

test('Mount CargoAdd component', async () => {
  expect(CargoAdd).toBeTruthy()

  const wrapper = mount(CargoAdd)

  expect(wrapper.text()).toContain('Add a shipment')
})

test('Cargo Add Button clicked', async () => {
  expect(CargoAdd).toBeTruthy()

  const wrapper = mount(CargoAdd)

  const cargoAddPopup = await wrapper.get('.addPopup')

  await wrapper.get('#cargoAddButton').trigger('click')
  expect(cargoAddPopup.isVisible()).toBe(true)
})
