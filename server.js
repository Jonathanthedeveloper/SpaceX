const mongoose = require('mongoose')

const app = require('./app')
const { PORT } = require('./config')


//So that mongoose no go disturb my ear with deprecation warning
mongoose.set('strictQuery', true)


// connecting to mongoose

mongoose.connect(process.env.URI)
    .then(() => console.log("Database connected successfully"))
    .catch((error) => console.error("Something went wrong while connecting to database: " + error))





const server = app.listen(PORT, function () {
    console.log(`Server listening on http://127.0.0.1:${PORT}`);
})


process.on("unhandledRejection", function (error) {
    console.log(error.name, error.message)
    server.close(function () {
        process.exit(1)
    })
})


process.on("uncaughtException", function (error) {
    console.log(error.name, error.message)
    server.close(function () {
        process.exit(1)
    })
})