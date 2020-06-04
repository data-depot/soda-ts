import {
  createQuery,
  createQuery$,
  where,
  limit,
  offset,
  queryClauseTransformer
} from '../src'
import { pipe } from 'ramda'

const SRC = 'w7w3-xahh'
const DOMAIN = 'data.cityofnewyork.us'

describe('query', () => {
  it('queryCreator', () => {
    const query = createQuery({ src: SRC })

    expect(query).toStrictEqual({
      src: SRC,
      domain: DOMAIN,
      apiPath: 'resource',
      clauses: []
    })
  })

  it('custom domain', () => {
    const DOMAIN = 'test.test.nyc'
    const query = createQuery({ src: SRC, domain: DOMAIN })

    expect(query.domain).toBe(DOMAIN)
  })

  it('default domain', () => {
    const query = createQuery({
      src: SRC,
      domain: undefined
    })

    expect(query.domain).toBe('data.cityofnewyork.us')
  })

  it('default api path', () => {
    const query = createQuery({ src: SRC })

    expect(query.apiPath).toBe('resource')
  })

  it('set api path', () => {
    const query = createQuery({
      src: SRC,
      apiPath: 'api/catalog/v1'
    })

    expect(query.apiPath).toBe('api/catalog/v1')
  })

  it('set domain', () => {
    const query = createQuery({
      src: SRC,
      domain: 'TEST'
    })

    expect(query.domain).toBe('TEST')
  })

  it('createQuery$', () => {
    createQuery$({ src: SRC }).subscribe((val) => {
      expect(val.src).toBe(SRC)
    })
  })

  it('query w/ clauses', () => {
    const src = '3h2n-5cm9'
    const todaysDate = new Date(new Date().getTime())
      .toISOString()
      .split('T')[0]
      .split('-')
      .join('')

    const pollingIssueDate = new Date(
      new Date().getTime() - 7 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split('T')[0]
      .split('-')
      .join('')

    const query = pipe(
      createQuery,
      where`issue_date between '${pollingIssueDate}' and '${todaysDate}'`,
      limit(10000),
      offset(0)
    )({ src })

    expect(query.clauses.length).toBe(3)
    expect(query.src).toBe(src)
    expect(query.clauses[2].value).toBe('0')
    expect(query.clauses[1].value).toBe('10000')
    expect(query.clauses[0].value).toBe(
      `issue_date between '${pollingIssueDate}' and '${todaysDate}'`
    )

    const transformedClauses = queryClauseTransformer(
      query.clauses
    )

    expect(transformedClauses[0][0]).toBe('$where')
  })
})
