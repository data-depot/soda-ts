import { pipe } from 'ramda'
import { AuthOpts, Query } from './types'
import { limit, offset } from './clauses'
import { createRunner } from './runner'
import debug from 'debug'

const logger = debug('soda-ts:manager')

interface ManagerOpts {
  limit: number
  offset: number
  authOpts?: AuthOpts
}

interface PaginationOpts {
  limit: number
  pageSize: number
  offset: number
  currentPage: number
}

export const updateQueryPaginator = (
  query: Query,
  paginationOpts: PaginationOpts
): Query => {
  const newQuery = {
    ...query,
    clauses: [
      ...query.clauses.filter(
        (clause) => clause.name !== '$offset'
      )
    ]
  }
  return offset(paginationOpts.offset)(newQuery)
}

export const createManager = <T>(opts: ManagerOpts) => (
  query: Query
) => {
  const paginationOpts: PaginationOpts = {
    limit: opts.limit,
    pageSize: opts.limit,
    offset: opts.offset,
    currentPage: 0
  }

  let paginatedQuery = pipe(
    limit(paginationOpts.limit),
    offset(paginationOpts.offset)
  )(query)

  const runner = createRunner<T>(opts.authOpts)

  const run = (): Promise<T> => {
    return runner(paginatedQuery)
  }

  const paginate = (): void => {
    paginationOpts.currentPage += 1
    paginationOpts.offset =
      paginationOpts.pageSize * paginationOpts.currentPage

    logger(
      `paginationOpts: ${JSON.stringify(paginationOpts)}`
    )
    paginatedQuery = updateQueryPaginator(
      paginatedQuery,
      paginationOpts
    )
  }

  return {
    run,
    paginate,
    get limit() {
      return paginationOpts.limit
    },
    get offset() {
      return paginationOpts.offset
    }
  }
}
