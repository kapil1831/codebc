const express = require('express');
//routes setup
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

require('./config/db')();

const app = express();

//middleware applied to all routes
app.use(express.json({
    type: ['application/json', 'text/plain']
}));
app.use(express.urlencoded({ extended: false }))

//routes
app.use('/api/blogs', blogRoutes);
app.use('/api/user', userRoutes);

//test route
app.get('/', (req, res) => {
    res.status(200).json({
        msg: "Hello from codebc.com"
    })
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started at ${port}...`);
});