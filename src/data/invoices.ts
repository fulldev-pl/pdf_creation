import { Invoice } from '../common/types'

export const invoices: Invoice[] = [
  {
    id: '00001',
    currency: 'EUR',
    createdAt: new Date(2024, 6, 30, 0, 0, 0, 0),
    dueDate: new Date(2024, 7, 13, 0, 0, 0, 0),
    billing: {
      buyer: {
        name: 'John Doe',
        address: '4420 Lincoln Hwy',
        city: 'Matteson',
        zip: '60443'
      },
      seller: {
        name: 'fulldev-pl',
        address: '6614 N 12th St',
        city: 'Philadelphia',
        zip: '19126',
        phone: '(215) 685-2848',
        tax_id: '379564491004956',
        bankAccountNr: '00111122223333444455556666'
      }
    },
    items: [
      {
        title: 'Programming services',
        price: 1000,
        quantity: 1
      },
      {
        title: 'Travel costs',
        price: 400,
        quantity: 1
      }
    ]
  }
]
