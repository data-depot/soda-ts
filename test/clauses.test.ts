import { createQuery } from '../src/query'
import type { Query } from '../src/types'
import { createRunner } from '../src/createRunner'

const SRC = 'w7w3-xahh'
const DOMAIN = 'data.cityofnewyork.us'
// const URL = 'https://data.cityofnewyork.us/resource/w7w3-xahh.json'

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

describe('createRunner', () => {
  let query: Query
  let runner: ReturnType<typeof createRunner>

  beforeAll(() => {
    query = createQuery('w7w3-xahh')
    runner = createRunner()
  })
  it('', async () => {
    const res = await runner(query)

    expect(res.length).toBeGreaterThan(1)
  })
})
