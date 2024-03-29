const MongoLib = require('../lib/mongo');

class UserMoviesService {
  constructor() {
    this.collection = 'user-movies';
    this.mongoDB = new MongoLib();
  }

  async getUserMovies( {userMovieId} ) {
    const query = userMovieId && { userMovieId };
    const userMovies = await this.mongoDB.getAll(this.collection, query);

    return userMovies || [];
  }

  async createUserMovie({ userMovie }) {
    const createdUserMovieId = await this.mongoDB.create(
      this.collection,
      userMovie
    );

    return createdUserMovieId;
  }

  async deleteUserMovie({ id }) {
    const deletedUserMovieId = await this.mongoDB.delete(
      this.collection,
      id
    );

    return deletedUserMovieId;
  }
}

module.exports = UserMoviesService;