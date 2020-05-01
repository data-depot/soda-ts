// pkgs
import { URLSearchParams } from 'url'
import got from 'got'
import debug from 'debug'

// local
import { Query } from './types'
import { queryClauseTransformer } from './clauses'

const logger = debug('soda-ts:runner')

interface AuthObj {
  // apiToken?: string
  appToken?: string
}

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
 *  select("city like 'NYC'")
 *  where('magnitude > 3.0')
 *  runner
 * )(query)
 */
export const createRunner = <T>(
  authOpts?: AuthObj
) => async (query: Query): Promise<T> => {
  const url = `https://${query.domain}/${query.apiPath}/${query.src}.json`

  logger(`making req to url: ${url}`)

  // TODO: cleanup param generation into a fn
  const clauseParams = queryClauseTransformer(query.clauses)
  logger(
    `making req with clauses: ${JSON.stringify(
      clauseParams
    )}`
  )

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
      .get(url, { headers, searchParams })
      .json<T>()
    return res
  } catch (e) {
    throw new Error(e.message)
  }
}