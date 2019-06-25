const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('.hbs', exphbs());
app.set('view engine', '.hbs');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', {layout: false});
});

app.post('/send', async (req, res) => {
    const output = `
        <p>Você tem um novo contato - eSATT</p>
        <h3>Detalhes do contato:</h3>
        <ul>
            <li>Nome: ${req.body.nome}</li>
            <li>Email: ${req.body.email}</li>
        </ul>
        <h3>Mensagem:</h3>
        <p>${req.body.message}</p> 
    `
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'ennh@cin.ufpe.br', // generated ethereal user
            pass: 'nitratodeprataAgNO3' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Erick Hora" <ennh@cin.ufpe.br>', // sender address
    to: "ennh@cin.ufpe.br", // list of receivers
    subject: "Contato - eSATT", // Subject line
    text: "Olá, tudo bem?", // plain text body
    html: output // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  res.render('index', {layout: false, msg: 'Email enviado...'});
});

// app.listen(3000, () => {
//     console.log('Server started!');
// });