import express, { response, urlencoded } from 'express'
import dotenv from 'dotenv'
import prisma from './db/prisma.js'
import e from 'express'

dotenv.config()

const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get('/users',async (request,response) => {
    const users =  await prisma.user.findMany()
    response.json({users})

})

app.post('/users',async (request,response) => {
    const {name,email,password} = request.body;
    const user = await prisma.user.findUnique({
        where : {
            email
        }
    })
    if(user){
        return response.status(403).json({message:"user with email already exist...!"})
    }
    const data = {name,email,password}
    await prisma.user.create({data});
    response.status(200).json({message:"data saves"})
})


app.get('/users/:id',async (request,response) =>{
    try{
        const id = parseInt (request.params.id)
        const user = await prisma.user.findUnique({
            where:{
                id:id
            }
        })
        if(!user){
            return response.status(404).json({message:"user not found"})
        }
        const data = {
            userId: user.id,
            userName : user.name,
            userEmail :user.email
        }
        return response.status(200).json(data);
    }catch(error){
        console.error("error fetching user",error);
        return response.status(500).json({message:"internal server error"})
    }
});

app.patch('/users/:id',async (request,response) => {
    const id = parseInt(request.params.id)
    const {name} = request.body;
    const alreadyUser = await prisma.user.findUnique({
        where:{id}
    })
    if (!alreadyUser){
        return response.status(404).json({message:"user not found"})
    }
    await prisma.user.update({
        where:{id},
        data:{
            name
        }
        
    })
    response.status(200).json({message:"User Updated Success Fully"})

})



app.delete('/users/:id',async (request,response) => {
    
    try{
        const id = parseInt(request.params.id)
        await prisma.user.delete({
            where :{id}
        })
        response.status(200).json({message:"user deleted successfully..."})
    }catch(error){
        response.status(400).json({message:error.message})
    }

})


app.post('/product', async (request,response) => {
    const {name,price,image} = data
    const product = await prisma.product.create({data})
    response.status(201).json({message:"product created success fully"})
})





app.listen(3000,()=>{
    console.log("server connected");
})