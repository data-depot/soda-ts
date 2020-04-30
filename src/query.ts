// local
import { Query } from './types'

/**
 * options for the `createQuery` fn
 */
interface QueryOpts {
  /** domain of data source */
  domain?: string
  /** rest path associated with api and domain */
  apiPath?: Query['apiPath']
}

/**
 * create Query Object for SODA req
 *
 * @param src data source identifier
 * @param queryOpts
 *
 * @returns `Query` object used by runners to make requests
 */
export const createQuery = (
  src: string,
  queryOpts?: Partial<QueryOpts>
): Query => {
  const domain =
    queryOpts?.domain ?? 'data.cityofnewyork.us'
  const apiPath = queryOpts?.apiPath ?? 'resource'
  return {
    src,
    domain,
    apiPath,
    clauses: []
  }
}
