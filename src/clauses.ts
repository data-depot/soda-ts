// import got from 'got'
import type { Query, Clause } from './types'

export interface Authorization {
  type: 'TOKEN' | 'USERNAME_PASS'
  username?: string
  password?: string
  token?: string
  domain: string
  timeout: number
}

// export interface Clause {
//   name: string
//   value: string
// }

// export interface Query {
//   src: string
//   domain: string
//   clauses: Array<Clause> | []
// }

// interface QueryOpts {
//   src: string
//   domain: string
// }

// /**
//  * create Query Object for SODA req
//  *
//  * @param src data source
//  * @param reqClauses SoSQL req clauses
//  *
//  * @returns `Query` object used by runners to make requests
//  */
// export const createQuery = (
//   queryOpts: QueryOpts
// ): Query => {
//   return {
//     src: queryOpts.src,
//     domain: queryOpts.domain,
//     clauses: []
//   }
// }

/**
 *
 * @param query
 * @param clause
 */
export const createClause = (
  query: Query,
  clause: Clause
): Query => {
  return {
    ...query,
    clauses: [
      ...query.clauses,
      { name: clause.name, value: clause.value }
    ]
  }
}

export const where = (query: Query, value: string): Query =>
  createClause(query, { name: '$where', value })

export const select = (
  query: Query,
  value: string
): Query => createClause(query, { name: '$select', value })

// const validateAuthentication = (authenticationOpts: Authorization) {}

// const createAuthorization = (
//   authorizationOpts: Authorization
// ): Authorization => {
//   // const [isValid, error] = validateAuthentication(authorizationOpts)

//   // if (!isValid) throw new Error(error.message)

//   return {
//     ...authorizationOpts
//   }
// }

// interface RunnerOptions {
//   auth: Authorization
//   identifier: string
// }

// export const createRunner = <T>() => (
//   query: Query
// ): Array<T> => {
//   return []
// }
