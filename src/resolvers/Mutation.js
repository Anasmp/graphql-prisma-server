const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {

    const password = await bcrypt.hash(args.password, 10)
 
    const user = await context.db.mutation.createUser({
      data: { ...args, password },
    }, `{ id }`)
  
 
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
  

    return {
      token,
      user,
    }
  }
  
  async function login(parent, args, context, info) {

    const user = await context.db.query.user({ where: { email: args.email } }, ` { id password } `)
    if (!user) {
      throw new Error('No such user found')
    }
  

    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }
  
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
  

    return {
      token,
      user,
    }
  }

  function post(parent, args, context, info) {
    const userId = getUserId(context)
    return context.db.mutation.createPost(
      {
        data: {
          url: args.url,
          description: args.description,
          postedBy: { connect: { id: userId } },
        },
      },
      info,
    )
  }
  async function vote(parent, args, context, info) {

    const userId = getUserId(context)
  

    const linkExists = await context.db.exists.Vote({
      user: { id: userId },
      link: { id: args.linkId },
    })
    if (linkExists) {
      throw new Error(`Already voted for link: ${args.linkId}`)
    }
  
   
    return context.db.mutation.createVote(
      {
        data: {
          user: { connect: { id: userId } },
          link: { connect: { id: args.linkId } },
        },
      },
      info,
    )
  }
  
  async function like(parent,args,context,info) {
    const userId = getUserId(context)

    const likeExists = await context.db.exists.Like({
      user: {id: userId},
      like:{id:args.linkId}
    })
    if(likeExists){
      throw new Error(`All ready Liked`)
    }
    return context.db.mutation.createLike(
      {
        data: {
          user: { connect: { id: userId } },
          like: { connect: { id: args.linkId } },
        },
      },
      info,
    )
  }
  module.exports = {
      signup,
      login,
      post,
      vote,
      like
  }