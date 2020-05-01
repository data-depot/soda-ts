import {
  createQuery,
  createClause,
  Query,
  clauseTransformer,
  queryClauseTransformer,
  Clause
} from '../src'

const CLAUSE = 'test'

describe('clauses', () => {
  let query: Query

  beforeEach(() => {
    query = createQuery('w7w3-xahh')
  })

  it('createClause attaches to query', async () => {
    const clause = createClause(CLAUSE)('test')(query)
    expect(clause.clauses).toHaveLength(1)
    expect(clause.clauses[0]).toMatchObject({
      name: expect.stringMatching(CLAUSE)
    })
  })

  it('use template literals for clauses', () => {
    const clause = createClause('test')`test is why name`(
      query
    )
    expect(clause.clauses).toHaveLength(1)
    expect(clause.clauses[0]).toMatchObject({
      name: expect.stringMatching(CLAUSE),
      value: expect.stringMatching('test is why name')
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
