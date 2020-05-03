// pkgs
import { pipe } from 'ramda'
import debug from 'debug'
import { Subject } from 'rxjs'

// local
import { AuthOpts, Query } from './types'
import { limit, offset } from './clauses'
import { createRunner } from './runner'

const logger = debug('soda-ts:manager')

/** options for pagiantion manager creation */
interface ManagerOpts {
  limit: number
  offset: number
  authOpts?: AuthOpts
}

/** options for pagination */
interface PaginationOpts {
  limit: number
  pageSize: number
  offset: number
  currentPage: number
}

/**
 * internal fn used in query managers to
 * update queries for pagination
 *
 * @param query
 * @param paginationOpts
 */
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

/** query manager, to be used for easy pagination */
export interface Manager<T> {
  /** grab data by initiating runner */
  run: () => Promise<T[]>
  /**
   * runs required side effect for runner to grab next
   * set of data
   */
  paginate: () => void
  /** limit value for paginaton used by manager */
  readonly limit: number
  /** offset value for pagination used by manager  */
  readonly offset: number
}

/**
 * create a manager creator fn
 *
 * @param opts manager options to be used to req
 * @returns manager creator fn
 */
export const createManagerCreator = <T>(
  opts: ManagerOpts
) => (query: Query): Manager<T> => {
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

  const runner = createRunner<T[]>(opts.authOpts)

  const run = (): Promise<T[]> => {
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

// TODO: fix: generic type mismatch between manager and subject
// currently all manager takes the type `T` which is then turned into an array
// on return from the runner. Meanwhile `Subjects` for `autoPagination` has to take `T[]`
// as it's being passed in by the user. Possible solution is to bring the paginator back into
// `Manager`. TBD

// TODO: feat: expose option for an end state, if not interested to grab whole data set
// currently auto paginator will continue to to run until the end of the data. There're
// cases when that's not desirable. So, we should expose a kill `boolean` expression, which
// when true, will break out of the loop

/**
 * automatically paginate through a data set
 *
 * @param manager runner manager used to grab and paginate through data
 * @param subject subject used to publish acquired data
 *
 */
export const autoPaginator = async <T>(
  manager: Manager<T>,
  subject: Subject<T[]>
): Promise<void> => {
  let currentPageSize = 0
  do {
    try {
      manager.paginate()
      const res = await manager.run()
      currentPageSize = res.length
      subject.next(res)
    } catch (e) {
      subject.error(e)
    }
  } while (currentPageSize === manager.limit)
}

// TODO: feat: add lazy `autoPaginator$`
// currently we are expsoing an async/await fn to run
// our paginator. It's not the most elegant. Best approach
// would be to wrap the promise in a defered observable.
// this way, one the `autoPaginator$` observable is subscrtibed too,
// it'll only then trigger the data fetch procedure. This
// also provides a nice integration point in projects where
// observables are being used
