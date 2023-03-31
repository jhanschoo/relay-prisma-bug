# relay-prisma

This is a minimal example to demonstrate that the typings of the
`@pothos/plugin-prisma` plugin with respect to indirect relations as relay connections
(https://pothos-graphql.dev/docs/plugins/prisma#indirect-relations-as-connections),
are incompatible with the `extendedWhereUnique` feature preview as of the
versions given in the `package.json`
(possibly only the `package-lock.json`).

Just run `npm i`, `npm run generate`, `npm run type`. `tsc` should
indicate a type error.

Now comment out `previewFeatures = ["extendedWhereUnique"]` in
`schema.prisma` and run `npm run generate`. Now
`npm run type` should succeed.

I exhibit a workaround. Uncomment the preview feature.
We coerce the `cursor` field to a sufficiently
small type like `undefined`, but `never` also works. Replace the
offending definition

```
      comments: postConnectionHelpers.getQuery(
        args,
        ctx,
        nestedSelection
      ),
```

with the commented out

```
      comments: postConnectionHelpers.getQuery(
        args,
        ctx,
        nestedSelection
      ) as ReturnType<typeof postConnectionHelpers.getQuery> & {
        cursor: undefined;
      },
```

Now `npm run type` should succeed.
