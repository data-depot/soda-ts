# soda-ts

## functional SoQL wrapper to interact with open data

| branch  |                                                                     coverage                                                                     |
| :------ | :----------------------------------------------------------------------------------------------------------------------------------------------: |
| staging | [![codecov](https://codecov.io/gh/data-depot/soda-ts/branch/staging/graph/badge.svg?token=6996L6JATW)](https://codecov.io/gh/data-depot/soda-ts) |
| master  | [![codecov](https://codecov.io/gh/data-depot/soda-ts/branch/master/graph/badge.svg?token=6996L6JATW)](https://codecov.io/gh/data-depot/soda-ts)  |

### install

```bash
# for js
yarn add ramda rxjs @data-depot/soda-ts
# for ts
yarn add -D @types/ramda
```

### use

`soda-ts` was designed with composition in mind.
To start of, we need to create a `query`.
Dataset `src` id must be provided while the
domain defaults to `NYC Open Data`

#### `createQuery`

```ts
import { createQuery } from '@data-depot/soda-ts'

const query = createQuery({ src: 'w7w3-xahh' })
```

A raw `query` is the most primitive form of query.
To make it more interesting, we need to compose it
with `clauses`

```ts
import { createQuery, where } from '@data-depot/soda-ts'
import { pipe } from 'ramda'

const query = pipe(
    createQuery
    where``
)({ src: 'w7w3-xahh' })
```

#### `createRunner$`

Now, we can run the `query`. We have a `Promise` and `Observable`
wrappers. For simple requests, `createRunner`, which is
`Promise` based, is quite useful. But we'd recommend
the `Observable` api.

```ts
import { createQuery, where, createRunner$ } from '@data-depot/soda-ts'
import { pipe } from 'ramda'

const authOpts = {
    appToken: '', // REQUIRED for authenticated req
    keysCamelCased: false // whether to serialize keys to camelCase from snake_case
}

pipe(
    createQuery
    where`something > 12`
    createRunner$(authOpts)
)({ src: '' })
    .subscribe(
        next: (rawData) => {},
        error: ...,
        complete: ...
    )
```

#### `autoPaginator$`

To grab large paginated datasets, we can take
advantage of `query` managers. They handle all aspects of
pagination automagically and uses `Subjects` from `rxjs`
as an eventbus. Combining `ramda` and `rxjs` composition,
we can write declarative code to handle all the side effects
cleanly.

```ts
import { createQuery, where, autoPaginator$, createManagerCreator } from '@data-depot/soda-ts'
import { pipe } from 'ramda'
import { Subject } from 'rxjs'

export const managerOpts = {
  limit: 5,
  offset: 0,
  authOpts: {
    appToken: '',
    keysCamelCased: true
  }
}

const paginatorSub = new Subject()

// create query
const query = pipe(
    createQuery
    where``
    createManagerCreator<RawData>(managerOpts),
    autoPaginator$(paginatorSub)
)({ src: '' })

paginatorSubject.subscribe({
    next(val) {
        // whatever you'd like to do with each page of data
    },
    error(e) {
        // handle error from individual req
    },
    complete() {
        //  handle end of all pagination reqs
    }
})

query.subscribe(
        error: (e) => {
            // handle if auto paginator breaks
        },
        complete: () => {
            // pagination completed
        }
    )
```
