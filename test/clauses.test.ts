import {
  createQuery,
  createClause,
  Query,
  createRunner,
  clauseTransformer,
  queryClauseTransformer,
  Clause
} from '../src'

const SRC = 'w7w3-xahh'
const DOMAIN = 'data.cityofnewyork.us'
const CLAUSE = 'test'
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
  it('successfully grabs ', async () => {
    const res = await runner(query)

    expect(res.length).toBeGreaterThan(1)
  })
})

describe('clauses', () => {
  let query: Query

  beforeEach(() => {
    query = createQuery('w7w3-xahh')
  })

  it('createClause attaches to query', async () => {
    const clause = createClause(CLAUSE)(query, 'test')
    expect(clause.clauses).toHaveLength(1)
    expect(clause.clauses[0]).toMatchObject({
      name: expect.stringMatching(CLAUSE)
    })
  })

  it('clause transforms', async () => {
    const transformedClause = clauseTransformer({
      name: '$where',
      value: 'test'
    })

    expect(transformedClause).toHaveLength(2)
    expect(transformedClause[0]).toBe('$where')
    expect(transformedClause[1]).toBe('test')
  })

  it('adds clauses to query', async () => {
    const clauses: Clause[] = [
      { name: '$where', value: 'test' },
      { name: '$select', value: 'test1' },
      { name: '$limit', value: '5' }
    ]

    const transformedClause = queryClauseTransformer(
      clauses
    )
    expect(transformedClause.length).toBeGreaterThan(1)
    expect(transformedClause[1][0]).toBe('$select')
  })
})
