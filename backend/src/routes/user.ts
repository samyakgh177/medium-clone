import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { singnupInput } from '@asmyaaak17/medium-common'
export const userRouter = new Hono<{
  Bindings:{
    DATABASE_URL:string
    JWT_SECRET:string
  },
  Variables:{
    userId:string
  }
}>()



userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

 

  try {
    const user = await prisma.user.create({
      data: {
        name:body.name,
        email: body.email,
        password: body.password,
      },
    });

    // Check if JWT_SECRET is present
    if (!c.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment");
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (e) {
    console.error("Signup Error:", e); // Log for debugging
    c.status(403);
    return c.json({ error: "Error while signing up" });
  }
});



userRouter.post('/signin', async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL ,
  }).$extends(withAccelerate())
  const body = await c.req.json()
  // const { success } = singninInput.safeParse(body);
  // if(!success){
  //   c.status(411);
  //   return c.json({message:"Inputs not correct"})
  // }
  const user = await prisma.user.findUnique({
    where:{
      email:body.email,
      password:body.password
    }
  })
  if(!user){
    c.status(403)
    return c.json({error:"User not found"})
  }
  const jwt = await sign({id:user.id},c.env.JWT_SECRET);
  return c.json({jwt})
})
