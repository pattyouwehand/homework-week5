const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/postgres');

const Movie = sequelize.define(
  'movie', 
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
  field: 'synopsis'
}}

)