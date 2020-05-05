// local
import { Query } from './types'

/**
 * options for the `createQuery` fn
 */
interface QueryOpts {
  /** source data id */
  src: string
  /** domain of data source */
  domain?: string
  /** rest path associated with api and domain */
  apiPath?: Query['apiPath']
}

/**
 * create Query Object for SODA req
 *
 * @param queryOpts
 *
 * @returns `Query` curried fn used by runners & managers to make requests
 */
export const createQuery = ({
  src,
  ...queryOpts
}: QueryOpts): Query => ({
  src: src,
  domain: queryOpts?.domain ?? 'data.cityofnewyork.us',
  apiPath: queryOpts?.apiPath ?? 'resource',
  clauses: []
})
