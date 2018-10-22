const { getUserId } = require('../utils')

function feed(parent, args, context, info) {
    const where = args.filter
    ? {
        OR: [
          { url_contains: args.filter },
          { description_contains: args.filter },
        ],
      }
    : {}

  return context.db.query.posts({ 
    where ,
    orderBy: args.orderBy
  }, info)
  }

  function me(parent,args,context,info) {
    const userId = getUserId(context)
    return context.db.query.user({ where: { id: userId } }, info)
  }
  
  module.exports = {
    feed,
    me
  }