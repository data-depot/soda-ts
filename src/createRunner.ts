import got from 'got'
import type { Query } from './types'
import debug from 'debug'

const logger = debug('soda-ts/runner')

export const createRunner = <T>() => async (
  query: Query
): Promise<Array<T>> => {
  const url = `https://${query.domain}/${query.apiPath}/${query.src}.json`
  console.log(url)
  try {
    const res = await got.get(url).json<T[]>()
    return res
  } catch (e) {
    logger(e)
    throw new Error(e.message)
  }
}
