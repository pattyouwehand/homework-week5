const express = require('express')
const app = express()
const port = 3000
const Sequelize = require('sequelize')
const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/postgres'
const sequelize = new Sequelize(databaseUrl)
const bodyParser = require('body-parser')
const { Router } = require('express')
const router = new Router

const Movie = sequelize.define(
  'movies', 
  { title: { 
      type: Sequelize.TEXT,
      field: 'movie_name' }
  },
  { yearOfRelease: {
      type: Sequelize.NUMBER,
      field: 'year_of_release' }
  },
  { synopsis: {
      type: sequelize.TEXT,
      field: 'synopsis' }
  })

sequelize
  .sync({ forse: true })
  .then(() => console.log('Database schema updated'))
  .then(() => Promise.all([
    Movie.create(
      { title: 'A Clockwork Orange', 
        yearOfRelease: 1971, 
        synopsis: `In the future, a sadistic gang leader is 
                  imprisoned and volunteers for a conduct-aversion 
                  experiment, but it doesn't go as planned.`
      }),
    Movie.create(
      { title: 'Fight Club',
        yearOfRelease: 1999,
        synopsis: `An insomniac office worker and a devil-may-care 
                  soapmaker form an underground fight club that evolves 
                  into something much, much more.`
      }),
    Movie.create(
      { title: 'Being John Malkovich ',
        yearOfRelease: 1999,
        synopsis: `A puppeteer discovers a portal that leads literally 
                  into the head of movie star John Malkovich.`
      })
  ]))
  .catch(console.error)

router.get(
  '/movies', 
  (req, res, next) => {
    Movie
    .findAll()
    .then(movieList => res.json(movieList))
    .catch(next)
})

router.post(
  '/movies',
  (req, res, next) => {
    Movie
    .create(req.body)
    .then(movie => res.json(movie))
    .catch(next)
})

router.get(
  '/movies/:id',
  (req, res, next) => {
    Movie
    .findByPk(req.params.id)
    .then(movieId => res.json(movieId))
    .catch(next) 
})

router.put(
  '/movies/:id',
  (req, res, next) => {
    Movie
    .findByPk(req.params.id)
    .then(movie => movie.update(req.body))
    .then(movie => res.json(movie))
    .catch(next)
})

router.delete(
  '/movies/:id',
  (req, res, next) => {
    Movie
    .destroy({ where : { id: req.params.id}})
    .then(number => res.json({ deleted: number}))
    .catch(next)
})

router.get(
  '/read-all',
  (req, res, next) => {
    const limit = req.query.limit || 25
    const offset = req.query.offset || 0

    Movie
    .count()
    .then(total => { Movie
      .findAndCountAll({ limit, offset })
      .then(movies => res.send({ movies, total }))
    })  
    .catch(next)
})

app.use(bodyParser.json())
app.use(router)
app.listen(port, () => console.log(`listening on port ${port}!`))