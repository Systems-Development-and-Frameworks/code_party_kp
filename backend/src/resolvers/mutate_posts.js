import User from "../db/entities/User";
import Post from "../db/entities/Post";
import { ForbiddenError } from "apollo-server";
import { delegateToSchema } from "@graphql-tools/delegate";

export default ({ subschema }) => ({
  Mutation: {
    write: async (_parent, { title }, context, info) => {
      let currentUser = await User.first({ id: context.id });
      if (!currentUser)
        throw new ForbiddenError("You must be authenticated to write a post!");
      const post = new Post({ title: title, author: currentUser });
      await post.save();
      const [resolvedPost] = await delegateToSchema({
        schema: subschema,
        operation: "query",
        fieldName: "Post",
        args: { id: post.id },
        context,
        info,
      });
      return resolvedPost;
    },
    upvote: async (_parent, args, context, info) => {
      let currentUser = await User.first({ id: context.id });
      if (!currentUser)
        throw new ForbiddenError("You must be authenticated to upvote a post!");
      let currentPost = await Post.first({ id: args.id });
      if (!currentPost)
        throw new ForbiddenError("Couldn't find a post with given id!");
      await currentPost.upvote(currentUser);
      const [resolvedPost] = await delegateToSchema({
        schema: subschema,
        operation: "query",
        fieldName: "Post",
        args: { id: currentPost.id },
        context,
        info,
      });
      return resolvedPost;
    },
  },
});
