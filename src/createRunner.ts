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
 *
 * @param authOpts optional auth options to make authenticated req
 */
export const createRunner = <T>(
  authOpts?: AuthObj
) => async (query: Query): Promise<Array<T>> => {
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
      .json<T[]>()
    return res
  } catch (e) {
    throw new Error(e.message)
  }
}
