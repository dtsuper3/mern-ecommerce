const app = require("./src/app")
const PORT = process.env.PORT || 3200;

app.listen(PORT, () => {
    console.log(`server is running on port: http://localhost:${PORT}`)
})