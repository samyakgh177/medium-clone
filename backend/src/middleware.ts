// export function inintMiddleware(app){
//     app.use('/api/v1/blog/*',async (c,next)=>{
//         //get the header 
//         //verify the header
//         //if the header is corect, we can proceed
//         //if not, we rerturn the user a 403 status code
//         const jwt = c.req.header('Authorization');
//         if(!jwt){
//         c.status(401);
//         return c.json({error:"unauthorized"})
//         }
//         const token = jwt.split(' ')[1];
//         const payload =  await verify(token,c.env.JWT_SECRET)
//         if(!payload){
//         c.status(401);
//         return c.json({error:"unauthorized"})
//         }
//         c.set('userId',payload.id)
//         await next()
//     })
// }    
    