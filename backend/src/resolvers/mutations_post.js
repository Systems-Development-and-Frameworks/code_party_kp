import User from '../db/entities/User';
import Post from '../db/entities/Post';
import {
  AuthenticationError,
  UserInputError,
  ForbiddenError,
  delegateToSchema
} from 'apollo-server';
export default ({ subschema }) => ({
  Mutation: {
    write: async (parent, args, context, info) => {
      const {user} = context;
      let currentUser = await User.first({id: user.id})
      if(!currentUser)
        throw new ForbiddenError("You must be authenticated to write a post")
      const post = new Post({...args, author: currentUser});
      //TODO: need to use this?
      // await post.save();
      // const [resolvedPost] = await delegateToSchema({
      //   schema: subschema, 
      //   operation: 'query',
      //   fieldName: 'Post',
      //   args: {id: post.id},
      //   context,
      //   info
      // });
      // return resolvedPost;
      return post;
    },
    upvote: async (parent, args, context) => {
      const {user} = context;
      let currentUser = await User.first({id: user.id})
      if(!currentUser)
        throw new ForbiddenError("You must be authenticated to write a post");
      const {post} = args;
      let currentPost = await Post.first({id: post.id})
      if(!currentPost) 
        throw new ForbiddenError("Dont found the post with this id")
      await currentPost.upvote(currentUser)
      //TODO: need to use this?
      // const [resolvedPost] = await delegateToSchema({
      //   schema: subschema, 
      //   operation: 'query',
      //   fieldName: 'Post',
      //   args: {id: post.id},
      //   context,
      //   info
      // });
      return currentPost;
    },
  },
});
