import {
  updateQueryPaginator,
  createQuery,
  Query,
  createManager
} from '../src'

const paginationOpts = {
  limit: 5,
  offset: 0,
  pageSize: 0,
  currentPage: 0
}

const managerOpts = {
  limit: 5,
  offset: 0,
  authOpts: {
    appToken: process.env.APP_TOKEN
  }
}

/* eslint-disable */
const rawData = {
  license_nbr: '1187577-DCA',
  license_type: 'Individual',
  lic_expir_dd: '2021-02-28T00:00:00.000',
  license_status: 'Active',
  license_creation_date: '2006-01-19T00:00:00.000',
  industry: 'Home Improvement Salesperson',
  business_name: 'TOP, HAMIT',
  address_city: 'JAMAICA',
  address_state: 'NY',
  address_zip: '11432'
}
/* eslint-enable */

type RawData = typeof rawData

describe('updates query clauses', () => {
  let query: Query

  beforeEach(() => {
    query = createQuery('w7w3-xahh')
  })

  it('updates query clauses', async () => {
    const newQuery = updateQueryPaginator(
      query,
      paginationOpts
    )

    expect(
      newQuery.clauses[newQuery.clauses.length - 1].value
    ).toBe('0')
  })
})

describe('manager', () => {
  let query: Query

  // let authenticatedRunner: ReturnType<typeof createRunner>

  beforeEach(() => {
    query = createQuery('w7w3-xahh')
  })

  it('run', async () => {
    const manager = createManager(managerOpts)(query)
    const paginationQuery = await manager.run()
    // console.log(paginationQuery)
    expect(paginationQuery).toBeTruthy()
  })

  it('paginate', async () => {
    const manager = createManager(managerOpts)(query)
    manager.paginate()
    expect(manager.offset).toBe(5)
  })

  it('paginates and fetches data', async () => {
    const manager = createManager<RawData[]>(managerOpts)(
      query
    )
    manager.paginate()
    const res = await manager.run()
    expect(manager.limit).toBe(5)
    expect(manager.offset).toBe(5)
    expect(res.length).toBe(manager.limit)
  })
})
