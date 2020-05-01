import {
  createQuery,
  createClause,
  Query,
  clauseTransformer,
  queryClauseTransformer,
  Clause,
  templateToString,
  clauseValueSerializer
} from '../src'

const CLAUSE = 'test'

describe('clauses', () => {
  let query: Query

  beforeEach(() => {
    query = createQuery('w7w3-xahh')
  })

  it('createClause attaches to query', () => {
    const clause = createClause(CLAUSE)('test')(query)
    expect(clause.clauses).toHaveLength(1)
    expect(clause.clauses[0]).toMatchObject({
      name: expect.stringMatching(CLAUSE)
    })
  })

  describe('input values', () => {
    it('template literals can handle returns', () => {
      const str = templateToString`
      hello
      world
      `

      expect(str).toBe('hello world')
    })

    it('template literals take our returns', () => {
      const clause = createClause('test')`
      test
      is
      why
      name
      `(query)

      expect(clause.clauses).toHaveLength(1)
      expect(clause.clauses[0]).toMatchObject({
        name: expect.stringMatching(CLAUSE),
        value: expect.stringMatching('test is why name')
      })
    })

    it('handle numberical values', () => {
      const clause = createClause('test')(0)(query)
      expect(clause.clauses).toHaveLength(1)
      expect(clause.clauses[0]).toMatchObject({
        name: expect.stringMatching(CLAUSE),
        value: expect.stringMatching('0')
      })
    })

    it('template literals w/ vars take our returns', () => {
      const TEST = 'test'
      const clause = createClause('test')`
      test
      is
      why
      name
      ${TEST}
      `(query)

      expect(clause.clauses).toHaveLength(1)
      expect(clause.clauses[0]).toMatchObject({
        name: expect.stringMatching(CLAUSE),
        value: expect.stringMatching(
          'test is why name test'
        )
      })
    })

    describe('serializer', () => {
      it('handle string value', () => {
        expect(clauseValueSerializer('some string')).toBe(
          'some string'
        )
      })
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

  it('clause transforms', () => {
    const transformedClause = clauseTransformer({
      name: '$where',
      value: 'test'
    })

    expect(transformedClause).toHaveLength(2)
    expect(transformedClause[0]).toBe('$where')
    expect(transformedClause[1]).toBe('test')
  })

  it('adds clauses to query', () => {
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
