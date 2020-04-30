import { createRunner, createQuery, Query } from '../src'

describe('createRunner', () => {
  let query: Query
  let runner: ReturnType<typeof createRunner>

  const authOpts = {
    appToken: process.env.APP_TOKEN
  }

  let authenticatedRunner: ReturnType<typeof createRunner>

  beforeAll(() => {
    query = createQuery('w7w3-xahh')
    runner = createRunner()
    authenticatedRunner = createRunner(authOpts)
  })

  it('successfully grabs ', async () => {
    const res = await runner(query)

    expect(res.length).toBeGreaterThan(1)
  })

  it('successfully grabs with authentication ', async () => {
    expect(authOpts.appToken).not.toBeUndefined()
    const res = await authenticatedRunner(query)
    expect(res.length).toBeGreaterThan(1)
  })

  it('runner fails when invalid token provided', async () => {
    const misAuthenticatedRunner = createRunner({
      appToken: 'au7shiadu7fhdas7s'
    })

    await expect(
      misAuthenticatedRunner(query)
    ).rejects.toThrow()
  })
})
