// pkgs
import { URLSearchParams } from 'url'
import got from 'got'
import debug from 'debug'
import { defer, from } from 'rxjs'
import camelCaseKeys from 'camelcase-keys'

// local
import { Query, AuthOpts } from './types'
import { queryClauseTransformer } from './clauses'

const logger = debug('soda-ts:runner')

/**
 * create runner functions which uses `Query` to get data
 *
 * @param authOpts optional auth options to make authenticated req
 * @returns runner fn
 *
 * ### Usage
 *
 * Runners are the main and only fn with side effects in `soda-ts`. Their job is to consume
 * `Query` and return a promise, which once resolved will give us the data or throw an error
 *
 * It's best to have one runner for each kind of query as they can be used for pagination and validation
 * in the future
 *
 * @example
 * const query = createQuery('data-set-id')
 * // generates unauthenticated runner
 * const runner = createRunner()
 *
 * await pipe(
 *  select`city like 'NYC'`
 *  where`magnitude > 3.0`
 *  runner
 * )(query)
 */
export const createRunner = <T>(
  authOpts?: AuthOpts
) => async (query: Query): Promise<T> => {
  const url = `https://${query.domain}/${query.apiPath}/${query.src}.json`

  logger(`making req to url: ${url}`)

  // TODO: refactor: cleanup param generation into a fn
  // use pure fn to generate the search params
  const clauseParams = queryClauseTransformer(query.clauses)
  logger(
    `making req with clauses: ${JSON.stringify(
      clauseParams
    )}`
  )

  // TODO: extract params generation into a fn
  const searchParams = new URLSearchParams(clauseParams)
  logger(
    `making req with params: ${searchParams.toString()}`
  )

  const headers = {
    ...(authOpts?.appToken && {
      'X-App-Token': authOpts?.appToken
    })
  }

  logger(
    `making req with headers: ${JSON.stringify(headers)}`
  )

  try {
    const res = await got
      .get(url, {
        headers,
        searchParams
        // hooks: {
        //   beforeRequest: [(options) => logger(options)]
        // }
      })
      .json<T>()

    if (authOpts?.keysCamelCased) {
      return camelCaseKeys(res)
    } else {
      return res
    }
    // return res
  } catch (e) {
    throw new Error(e.message)
  }
}

/**
 * fn to create observable runner curry fn
 *
 * @param authOpts options for authentication
 */
export const createRunner$ = <T>(authOpts?: AuthOpts) => (
  query: Query
) => defer(() => from(createRunner<T>(authOpts)(query)))
