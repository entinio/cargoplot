export class Shipment {
  id: number
  customer: string | null
  vessel: string | null
  'shipment-eta': Date | null

  constructor() {
    this.id = 0
    this.customer = null
    this.vessel = null
    this['shipment-eta'] = null
  }
}
