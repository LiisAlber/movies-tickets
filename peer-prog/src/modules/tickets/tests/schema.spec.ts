import { parse } from '../schema'
import { ticketsFactory } from './utils'

it('parses a valid tickets data', () => {
  const tickets = ticketsFactory()

  expect(parse(tickets)).toEqual(tickets)
})
