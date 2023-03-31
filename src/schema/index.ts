import { prismaConnectionHelpers } from "@pothos/plugin-prisma";
import { builder } from "../builder";
import { db } from "../db";

const User = builder.prismaNode("User", {
  id: { field: "id" },
  fields: (t) => ({
    name: t.exposeString("name"),
  }),
});

const Post = builder.prismaNode("Post", {
  id: { field: "id" },
  fields: (t) => ({
    title: t.exposeString("title"),
  }),
});

const Comment = builder.prismaNode("Comment", {
  id: { field: "id" },
});

const postConnectionHelpers = prismaConnectionHelpers(builder, Comment, {
  cursor: "id",
  select: (nodeSelection) => ({
    post: nodeSelection(true),
  }),
  resolveNode: ({ post }) => post,
});

builder.prismaObjectFields("User", (t) => ({
  postsCommentedOn: t.connection({
    type: Post,
    select: (args, ctx, nestedSelection) => ({
      comments: postConnectionHelpers.getQuery(
        args,
        ctx,
        nestedSelection
      ),
      // comments: postConnectionHelpers.getQuery(
      //   args,
      //   ctx,
      //   nestedSelection
      // ) as ReturnType<typeof postConnectionHelpers.getQuery> & {
      //   cursor: undefined;
      // },
    }),
    resolve: (user, args, ctx) =>
      postConnectionHelpers.resolve(user.comments, args, ctx),
  }),
}));

builder.queryType({
  fields: (t) => ({
    user: t.prismaField({
      type: User,
      nullable: true,
      resolve: (query) => {
        return db.user.findFirst({
          ...query,
        });
      },
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    noop: t.field({
      type: "String",
      resolve: () => "noop",
    }),
  }),
});

export const schema = builder.toSchema();
