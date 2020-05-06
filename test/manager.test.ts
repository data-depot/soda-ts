// pkgs
import { Subject } from 'rxjs'
import { pipe } from 'ramda'

// local
import {
  updateQueryPaginator,
  createQuery,
  Query,
  createManagerCreator,
  autoPaginator,
  Manager,
  where,
  autoPaginator$
} from '../src'
import {
  RawData,
  MANAGER_OPTS,
  MANAGER_OPTS_CAMEL_CASE_KEYS,
  PAGINATION_OPTS
} from './fixtures'

describe('manager', () => {
  describe('updates query clauses', () => {
    let query: Query

    beforeEach(() => {
      query = createQuery({ src: 'w7w3-xahh' })
    })

    it('updates query clauses', async () => {
      const newQuery = updateQueryPaginator(
        query,
        PAGINATION_OPTS
      )

      expect(
        newQuery.clauses[newQuery.clauses.length - 1].value
      ).toBe('0')
    })
  })

  describe('createManager', () => {
    let query: Query

    // let authenticatedRunner: ReturnType<typeof createRunner>

    beforeEach(() => {
      query = createQuery({ src: 'w7w3-xahh' })
    })

    it('run', async () => {
      const manager = createManagerCreator(MANAGER_OPTS)(
        query
      )
      const paginationQuery = await manager.run()
      // console.log(paginationQuery)
      expect(paginationQuery).toBeTruthy()
    })

    it('paginate', async () => {
      const manager = createManagerCreator(MANAGER_OPTS)(
        query
      )
      manager.paginate()
      expect(manager.offset).toBe(5)
    })

    it('paginates and fetches data', async () => {
      const manager = createManagerCreator<RawData[]>(
        MANAGER_OPTS
      )(query)
      manager.paginate()
      const res = await manager.run()
      expect(manager.limit).toBe(5)
      expect(manager.offset).toBe(5)
      expect(res.length).toBe(manager.limit)
    })
  })

  describe('autoPaginator', () => {
    let query: Query
    let paginatorSubject: Subject<RawData[]>
    let manager: Manager<RawData>

    beforeEach(() => {
      query = createQuery({
        src: 'w7w3-xahh'
      })
      paginatorSubject = new Subject<RawData[]>()
      manager = createManagerCreator<RawData>(MANAGER_OPTS)(
        query
      )
    })

    // eslint-disable-next-line jest/no-test-callback
    it('auto pagination return val', async (done) => {
      paginatorSubject.subscribe((val) => {
        expect(val).toBeTruthy()
        expect(val).toHaveLength(5)
        done()
      })

      await autoPaginator(manager, paginatorSubject)
    })

    // eslint-disable-next-line jest/no-test-callback
    it('auto pagination returns data over time', async (done) => {
      let currReq = 0

      paginatorSubject.subscribe((val) => {
        expect(val).toBeTruthy()
        expect(val).toHaveLength(5)
        currReq++
        if (currReq === 3) {
          expect(currReq).toBe(3)
          done()
        }
      })

      await autoPaginator(manager, paginatorSubject)
    })

    // eslint-disable-next-line jest/no-test-callback
    it('auto pagination failure sends out error', async (done) => {
      const newQuery = createQuery({ src: '' })
      const newManager = createManagerCreator<RawData>(
        MANAGER_OPTS
      )(newQuery)

      paginatorSubject.subscribe({
        error: (e) => {
          expect(e).toBeTruthy()
          done()
        }
      })

      await autoPaginator(newManager, paginatorSubject)
    })

    // eslint-disable-next-line jest/no-test-callback
    it('auto pagination returns new data over time', async (done) => {
      let currReq = 0
      let oldData: RawData[]
      let currData: RawData[]

      paginatorSubject.subscribe((val) => {
        if (currData) {
          oldData = currData
        }
        currData = val
        expect(val).toBeTruthy()
        expect(val).toHaveLength(5)
        currReq++
        if (currReq === 2) {
          expect(currReq).toBe(2)
          expect(oldData).not.toStrictEqual(currData)
          done()
        }
      })

      await autoPaginator(manager, paginatorSubject)
    })

    // eslint-disable-next-line jest/no-test-callback
    it('completion', async (done) => {
      query = pipe(
        createQuery,
        where`license_nbr='1232665-DCA'`
      )({
        src: 'w7w3-xahh'
      })

      manager = createManagerCreator<RawData>(MANAGER_OPTS)(
        query
      )

      paginatorSubject.subscribe({
        next(val) {
          expect(val.length).toBe(1)
        },
        complete() {
          done()
        }
      })

      await autoPaginator(manager, paginatorSubject)
    })

    // eslint-disable-next-line jest/no-test-callback
    it('autoPaginator$', (done) => {
      let res: RawData[]

      paginatorSubject.subscribe({
        next(val) {
          console.log(val)
          expect(val.length).toBe(1)
          res = val
        },
        complete() {
          expect(res).toBeTruthy()
          done()
        }
      })

      pipe(
        createQuery,
        where`license_nbr='1232665-DCA'`,
        createManagerCreator<RawData>(MANAGER_OPTS),
        autoPaginator$(paginatorSubject)
      )({
        src: 'w7w3-xahh'
      }).subscribe({
        complete() {
          expect(res).toBeTruthy()
          expect(res.length).toBe(1)
          done()
        }
      })
    })
    // eslint-disable-next-line jest/no-test-callback
    it('autoPaginator$ with camelCased keys', (done) => {
      let res: RawData[]

      pipe(
        createQuery,
        where`license_nbr='1232665-DCA'`,
        createManagerCreator<RawData>(
          MANAGER_OPTS_CAMEL_CASE_KEYS
        ),
        autoPaginator$(paginatorSubject)
      )({
        src: 'w7w3-xahh'
      }).subscribe({
        complete() {
          expect(res).toBeTruthy()
          expect(res.length).toBe(1)
          done()
        }
      })

      paginatorSubject.subscribe({
        next(val) {
          console.log(val)
          expect(val.length).toBe(1)
          res = val
        }
      })
    })
  })
})
