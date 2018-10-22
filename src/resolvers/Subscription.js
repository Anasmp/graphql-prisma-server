function newPostSubscribe (parent, args, context, info) {
    return context.db.subscription.post(
      { where: { mutation_in: ['CREATED'] } },
      info,
    )
  }
  function newVoteSubscribe (parent, args, context, info) {
    return context.db.subscription.vote(
      { where: { mutation_in: ['CREATED'] } },
      info,
    )
  }
  const newPost = {
    subscribe: newPostSubscribe,

  }
  const newVote = {
    subscribe: newVoteSubscribe
  }
  
  module.exports = {
    newPost,
    newVote,
  }