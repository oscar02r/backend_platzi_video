const express = require('express');
const app = express();
const {config} = require('./config/index');
const authApi = require('./routes/auth');
const moviesApi = require('./routes/movies');
const userMovieApi = require('./routes/userMovies');
const {logErrors, errorHandler, wrapErrors } = require('./utils/middleware/errorHandlers');
const notFoundHandler = require('./utils/middleware/notFoundHandler');
const helmet = require('helmet');

//Body parser
app.use(express.json());
app.use(helmet());
//app.use(express.urlencoded({ extended:false}));
// routes
authApi(app);
moviesApi(app);  
userMovieApi(app); 


// Los middleware de errores siempre van debajo de las rutas porque las rutas tambien son middleware
app.use(notFoundHandler);
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, function(){
     console.log(`Listening http://localhost:${config.port}`);
});