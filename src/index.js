import express from 'express'
import cartRouter from './routes/cartRouter.js'
import productsRoutes from './routes/productsRoutes.js'
import upload from './config/multer.js'
import chatRouter from './routes/chatRouter.js'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import { __dirname } from './path.js'

const app = express()
const PORT = 8080
//server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server (server)

//MIDDLEWARES
app.use(express.json())
app.engine('handlebars', engine()) // confirguro para usar handlebars
app.set('view engine', 'handlebars')// confirguro para usar handlebars
app.set('views', __dirname + '/views')// aca digo donde se esta usando


const mensajes = []
io.on('connection', (socket)=>{
    console.log("conecion con socket.io")

    socket.on('mensaje', info =>{
        console.log(info)
        mensajes.push(info)
        io.emit('mensajeLogs', mensajes)
    })
})


//ROUTES
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/products', productsRoutes, express.static(__dirname + '/public'))
app.use('/api/cart', cartRouter)
app.use('/api/chat', chatRouter, express.static(__dirname + '/public'))

app.post('/upload', upload.single('product'), (req, res) => {
    try {
        console.log(req.file)
        res.status(200).send("Imagen cargada correctamente")
    } catch (e) { 
        res.status(500).send("Error al cargar imagen")
    }
})











