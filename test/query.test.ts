import { createQuery } from '../src'

const SRC = 'w7w3-xahh'
const DOMAIN = 'data.cityofnewyork.us'

describe('query', () => {
  it('queryCreator', () => {
    const query = createQuery(SRC)

    expect(query).toStrictEqual({
      src: SRC,
      domain: DOMAIN,
      apiPath: 'resource',
      clauses: []
    })
  })
})
