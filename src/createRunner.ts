import { URLSearchParams } from 'url'
import got from 'got'
import type { Query } from './types'
import { queryClauseTransformer } from './clauses'
import debug from 'debug'

const logger = debug('soda-ts/runner')

interface AuthObj {
  // apiToken?: string
  appToken?: string
}

export const createRunner = <T>(
  authOpts?: AuthObj
) => async (query: Query): Promise<Array<T>> => {
  const url = `https://${query.domain}/${query.apiPath}/${query.src}.json`

  const clauseParams = queryClauseTransformer(query.clauses)

  const searchParams = new URLSearchParams(clauseParams)

  const headers = {
    ...(authOpts?.appToken && {
      'X-App-Token': authOpts?.appToken
    })
  }

  try {
    const res = await got
      .get(url, { headers, searchParams })
      .json<T[]>()
    return res
  } catch (e) {
    logger(e)
    throw new Error(e.message)
  }
}
