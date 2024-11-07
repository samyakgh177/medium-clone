import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'

export const blogRouter = new Hono<{
  Bindings:{
    DATABASE_URL:string
    JWT_SECRET:string
  },
  Variables:{
    userId:string
  }
}>()

blogRouter.use(async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader) {
    c.status(401);
    return c.json({ error: "Unauthorized: Missing token" });
  }

  let token: string | undefined;

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = authHeader; // Assume the entire header is the token
  }

  if (!token) {
    c.status(401);
    return c.json({ error: "Unauthorized: Token not provided" });
  }

  try {
    const payload = await verify(token, c.env.JWT_SECRET);

    if (!payload || !payload.id) {
      c.status(401);
      return c.json({ error: "Unauthorized: Invalid token payload" });
    }

    // Set userId in context variables
    //@ts-ignore
    c.set('userId', payload.id);
  } catch (error) {
    console.error("Token verification failed:", error);
    c.status(401);
    return c.json({ error: "Unauthorized: Token verification failed" });
  }

  await next();
});

//route to initialize a blog
blogRouter.post('/', async (c) => {
  const userId = c.get('userId')
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL ,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const post = await prisma.post.create({
    data:{
      title: body.title,
			content: body.content,
			authorId: userId
    }
  });
  return c.json({
    id:post.id
  })
})

//route to update blog
blogRouter.put('/', async(c) => {
  const userId = c.get('userId')
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL ,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  prisma.post.update({
      where:{
        id:body.id,
        authorId:userId
      },
      data:{
        title:body.title,
        content:body.content
      }
    })
  return c.text('updated post')
})

//route to get all blogs
blogRouter.get('/bulk',async(c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL ,
  }).$extends(withAccelerate());

  const blogs = await prisma.post.findMany({
    select:{
      content:true,
      title:true,
      id:true,
      author:{
        select:{
          name:true
        }
      }
    }
  })

  return c.json({blogs})
})

// route to get a blog
blogRouter.get('/:id', async(c) => {
  const id = c.req.param('id');
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL ,
  }).$extends(withAccelerate());
  try{
    const blogs = await prisma.post.findUnique({
      where:{
        id
      },
      select:{
        id:true,
        title:true,
        content:true,
        author:{
          select:{
            name:true
          }
        }
      }
    })
    return c.json({blogs});

  }catch(e){
    c.status(411);
    return c.json({
      message:"Error while fetching message"
    })
  }
  
})


  