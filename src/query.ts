import { of, Observable } from 'rxjs'

// local
import { Query } from './types'

/**
 * options for the `createQuery` fn
 */
export interface QueryOpts {
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
 * @param queryOpts options to create a query w/
 *
 * @returns `Query` used by runners & managers to make requests
 */
export const createQuery = ({
  src,
  domain,
  apiPath
}: QueryOpts): Query => ({
  src: src,
  domain: domain ?? 'data.cityofnewyork.us',
  apiPath: apiPath ?? 'resource',
  clauses: []
})

/**
 * create Query Observable for SODA req
 *
 * @param queryOpts options to create a query w/
 *
 * @returns `Query` Observable
 */
export const createQuery$ = (
  opts: QueryOpts
): Observable<Query> => of(createQuery(opts))
