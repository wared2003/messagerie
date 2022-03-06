const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Msg = require('./models/msg');
const bodyParser = require("body-parser");


app.use(bodyParser.json());





const auth = require('./middleware/auth');


mongoose.connect('mongodb+srv://messagerie:0u1MqzeywddbtSy0@cluster0.ynzps.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

 app.get('/', (req, res)=>{
     res.sendFile(`${__dirname}/public/index.html`);
 })

app.post('/user', (req, res)=>{
    console.log('hjjjj')
    console.log(req.body)
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        pseudo: req.body.pseudo
    });
    user.save()
    return res.status(200).json({ message: 'Utilisateur creer' });

})

app.get('/login', (req, res)=>{
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            if (req.body.password == user.password){
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id, username: user.name },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                });
            }else{
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }


                })
                .catch(error => res.status(500).json({ error }));
        })



io.on('connection', (socket) => {
    console.log('nouvel connexion')
    Msg.find().forEach((txt)=>{
        console.log(txt);
    })

    socket.on("chat message", (msg)=>{
        console.log(msg);
        const chat = new Msg({
            message: msg,
        });
        chat.save()
        socket.emit("chat message", msg)
    })
})



server.listen(3000, ()=>{
    console.log('serveur démaré');
})