const express = require('express')
const app = express()
//const bcrypt = require('bcrypt')

//app.use(express.json())

app.set('view-engine', 'ejs')

//const users = []

app.get('/users', (req, res) => {
  res.render('index.ejs', {name: 'Kyle' })
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

// app.post('/register', (req, res) => {
//
// })

// app.post('/users', async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10)
//     const user = { name: req.body.name, password: hashedPassword }
//     users.push(user)
//     res.status(201).send()
//   } catch {
//     res.status(500).send()
//   }
// })
//
// app.post('/users/login', async (req, res) => {
//   const user = users.find(user => user.name = req.body.name)
//   if (user == null) {
//     return res.status(400).send('Cannot find user')
//   }
//   try {
//     if(await bcrypt.compare(req.body.password, user.password)) {
//       res.send('Success')
//     } else {
//       res.send('Not allowed')
//     }
//   } catch {
//     res.status(500).send()
//   }
// })

app.listen(3000)
