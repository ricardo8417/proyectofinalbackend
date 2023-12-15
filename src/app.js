import  express from "express";
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import mongoose from "mongoose";
import productsRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import productModel from "./Dao/models/Product.models.js";
import messagesModel from "./Dao/models/Messages.models.js";
import session from "express-session"
import MongoStore from "connect-mongo"

import sessionRouter from "./routes/session.router.js";
import viewsRouter from "./routes/views.router.js";

import __dirname from './utils.js'



const app = express()
const uri ="mongodb+srv://ricardo:Matrix39@cluster0.e5qotqq.mongodb.net/?retryWrites=true&w=majority"
const dbName="ecommerce"

// //Configuración de cookies
// app.use(cookieParser('CookiesCifradas'))

// app.get('/set',(req,res)=>{
//   res
//   .cookie('CookiedePrueba', 'Tenemos una cookie!!',{maxAge:3000}).send('Cookie Seteada')
//   .cookie('cookieSigned','Valor de la cookie',{signed:true})//cookie cifrada
// })

// app.get('get',(req,res)=>{
//   const cookie=req.cookies
//   const cookieSigned=req.signedCookies
//   console.log (cookie,cookieSigned)
// })

//Para traer información POST como JSON
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/static", express.static(__dirname + "/public"));

//Configurar los motores de plantilla
app.engine('handlebars',handlebars.engine())
app.set('views', __dirname + '/views' )
app.set('view engine', 'handlebars')




 

//Conección a la Database
// mongoose.set("strictQuery", false);
console.log('conectando...')

 
mongoose.connect(uri, {dbName })
.then(()=>{
  console.log('DB connected!!')

//Configuración socket.io
  const httpServer= app.listen(8080,()=>console.log('Listening...'));
  const io = new Server(httpServer);
io.on("connection", (socket) => {

  console.log("cliente conectado");
  socket.on("new-product", async (product) => {
          
      await productModel.create(product);
      const dataproduct = await productModel.find().lean().exec()
      io.emit("reload-table", dataproduct);
    })
    socket.on("new", async user => {
      console.log(`${user} se acaba de conectar`) 
    const userCreated = new messagesModel(user)
          await userCreated.save()
    })

socket.on("message", async (data) => {
    try {
        await messagesModel.create(data);
    const messages = await messagesModel.find().lean().exec();
    io.emit("logs", messages);
  } catch (error) {
    console.error("Error al guardar mensajes", error);
  }
});
  });
})
  .catch(e=> console.log("Can't connected to DB"))

//Configurar  Mongo Session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: uri,
      dbName,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 10000,
    }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


//Rutas
app.use('/', viewsRouter)
app.use('/api/products',productsRouter)
app.use('/api/carts',cartRouter)
app.use("/api/session", sessionRouter);

  

