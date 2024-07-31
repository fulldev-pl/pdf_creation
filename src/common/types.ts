export type Invoice = {
  id: string
  currency: 'EUR' | 'USD'
  createdAt: Date
  dueDate: Date
  billing: {
    seller: BillingInfo & { bankAccountNr: string }
    buyer: Omit<BillingInfo, 'tax_id'>
  }
  items: {
    title: string
    price: number
    quantity: number
  }[]
}

export type BillingInfo = {
  name: string
  address: string
  zip: string
  city: string
  tax_id: string
  phone?: string
  email?: string
}
