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

  it('custom domain', () => {
    const DOMAIN = 'test.test.nyc'
    const query = createQuery(SRC, {
      domain: DOMAIN
    })

    expect(query.domain).toBe(DOMAIN)
  })

  it('default domain', () => {
    const query = createQuery(SRC)

    expect(query.domain).toBe('data.cityofnewyork.us')
  })

  it('default api path', () => {
    const query = createQuery(SRC)

    expect(query.apiPath).toBe('resource')
  })

  it('set api path', () => {
    const query = createQuery(SRC, {
      apiPath: 'api/catalog/v1'
    })

    expect(query.apiPath).toBe('api/catalog/v1')
  })
})
