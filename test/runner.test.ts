import {
  createRawRunner,
  createJsonRunner,
  createCsvRunner,
  createQuery,
  Query,
  where,
  limit,
  offset,
  createRunner$
} from '../src'
import { pipe } from 'ramda'

import { RAW_DATA, RawData } from './fixtures'

describe('createRunner', () => {
  let query: Query
  let runner: ReturnType<typeof createRawRunner>

  const authOpts = {
    appToken: process.env.APP_TOKEN
  }

  let authenticatedRunner: ReturnType<typeof createRawRunner>

  beforeAll(() => {
    query = createQuery({ src: 'w7w3-xahh' })
    runner = createRawRunner()
    authenticatedRunner = createRawRunner(authOpts)
  })

  it('successfully grabs ', async () => {
    await expect(runner(query)).resolves.toBeTruthy()
  })

  it('successfully grabs with authentication ', async () => {
    expect(authOpts.appToken).not.toBeUndefined()
    await expect(
      authenticatedRunner(query)
    ).resolves.toBeTruthy()
  })

  describe('$where', () => {
    it('gt operator ', async () => {
      expect(authOpts.appToken).not.toBeUndefined()

      const query = createQuery({
        src: '4tka-6guv',
        domain: 'soda.demo.socrata.com'
      })

      const testRunner = createJsonRunner<RawData[]>()

      const res = pipe(
        where('magnitude > 3.0'),
        testRunner
      )(query)

      await expect(res).resolves.toBeTruthy()
    })

    it('like operator ', async () => {
      expect(authOpts.appToken).not.toBeUndefined()

      const query = createQuery({
        src: 'w7w3-xahh',
        domain: 'data.cityofnewyork.us'
      })

      const testRunner = createJsonRunner<RawData[]>()

      const res = pipe(
        where("license_nbr like '1232665-DCA'"),
        testRunner
      )(query)

      await expect(res).resolves.toBeTruthy()
    })

    it('eq operator ', async () => {
      expect(authOpts.appToken).not.toBeUndefined()

      const query = createQuery({
        src: 'w7w3-xahh',
        domain: 'data.cityofnewyork.us'
      })

      const testRunner = createJsonRunner<RawData[]>()

      const res = pipe(
        where`license_nbr = '1232665-DCA'`,
        testRunner
      )(query)

      await expect(res).resolves.toBeTruthy()
    })

    it('between operator ', async () => {
      const authOpts = {
        appToken: process.env.APP_TOKEN
      }

      const dateToday = new Date()
        .toISOString()
        .slice(0, 19)
      expect(authOpts.appToken).not.toBeUndefined()

      const query = createQuery({
        src: 'w7w3-xahh',
        domain: 'data.cityofnewyork.us'
      })

      const testRunner = createJsonRunner<RawData[]>(
        authOpts
      )

      const res = pipe(
        where`license_creation_date between "${RAW_DATA.license_creation_date}" and "${dateToday}"`,
        testRunner
      )(query)
      await expect(res).resolves.toBeTruthy()
    })

    it('pagination operator ', async () => {
      const authOpts = {
        appToken: process.env.APP_TOKEN
      }

      const query = createQuery({
        src: 'w7w3-xahh',
        domain: 'data.cityofnewyork.us'
      })

      const testRunner = createJsonRunner<RawData[]>(
        authOpts
      )

      const res = pipe(
        limit('5'),
        offset('0'),
        testRunner
      )(query)

      await expect(res).resolves.toBeTruthy()
    })
  })

  it('runner fails when invalid token provided', async () => {
    const misAuthenticatedRunner = createRawRunner({
      appToken: 'au7shiadu7fhdas7s'
    })

    await expect(
      misAuthenticatedRunner(query)
    ).rejects.toThrow()
  })

  // eslint-disable-next-line jest/no-test-callback
  it('createRunner$', (done) => {
    const authOpts = {
      appToken: process.env.APP_TOKEN
    }
    createRunner$<RawData[]>(authOpts)(query).subscribe(
      (val) => {
        expect(val).toBeTruthy()
        expect(
          Object.keys(val[0]).length
        ).toBeGreaterThanOrEqual(10)
        done()
      }
    )
  })

  it('json support', async () => {
    const authOpts = {
      appToken: process.env.App_Token,
      keyCamelCased: false
    }
    query = createQuery({
      src: 'w7w3-xahh',
      domain: 'data.cityofnewyork.us',
      apiPath: 'resource'
    })
    const testRunner = await createJsonRunner<RawData[]>(
      authOpts
    )
    const res = await pipe(
      limit('10'),
      offset('0'),
      testRunner
    )(query)
    expect(res.length).toBeGreaterThanOrEqual(5)
  })

  it('csv support', async () => {
    const authOpts = {
      appToken: process.env.App_Token
    }
    query = createQuery({
      src: '3h2n-5cm9',
      domain: 'data.cityofnewyork.us',
      apiPath: 'resource'
    })
    const testRunner = await createCsvRunner(authOpts)
    const res = await pipe(
      limit('5'),
      offset('0'),
      testRunner
    )(query)
    expect(res).toBeTruthy()
    expect(res.length).toBeGreaterThanOrEqual(5)
  })

  it('createRunnerRaw', async () => {
    const authOpts = {
      appToken: process.env.App_Token
    }
    query = createQuery({
      src: '3h2n-5cm9',
      domain: 'data.cityofnewyork.us',
      apiPath: 'resource'
    })
    const testRunner = await createRawRunner(authOpts)
    const res = await pipe(
      limit('5'),
      offset('0'),
      testRunner
    )(query)
    expect(res).toBeTruthy()
  })
})
