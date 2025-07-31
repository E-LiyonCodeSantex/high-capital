const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const hbs = require('hbs');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const webRoutes = require('./routes/webRoutes');
const session = require('express-session');
const { createAdmin } = require('./controllers/adminController');

dotenv.config(); // Load environment variables



app.use(session({
    secret: 'yourSecretKey', // use a strong secret in production!
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set to true if using HTTPS
    store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  })
}));

// Use cookie-parser middleware
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB connected...');
        await createAdmin(); // Create admin account
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // Exit if connection fails
    });

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use userRoutes for all routes
app.use('/user', userRoutes);
app.get('/user', (req, res) => {
    res.redirect('/user/login');
});
app.use('/admin', adminRoutes);
app.use('/web', webRoutes);
app.get('/', (req, res) => {
    res.redirect('/web');
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const publicPath = path.join(__dirname, '../client');
app.use(express.static(publicPath));

// Set up Handlebars view engine
// Register the `@json` helper explicitly
const exphbsInstance = exphbs.create({
    extname: '.hbs',
    helpers: {
        json: (context) => JSON.stringify(context),
        '@json': (context) => JSON.stringify(context), // Register as @json
        eq: (a, b) => String(a) === String(b),
        isOnline: function (lastActiveAt) {
            return lastActiveAt && (new Date() - new Date(lastActiveAt) < 5 * 60 * 1000);
        },
        capitalize: function (str) {
            if (typeof str !== 'string') return '';
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },
        formatDate: function (date) {
            if (!date) return '';
            // This will output: Mon Jun 09 2025 00:49:31
            return new Date(date).toString().split(' GMT')[0];
        },
        array: (...args) => args.slice(0, -1),
        formatDateNumbersOnly: function(date) {
            if (!date) return '';
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day} ${month} ${year}`;
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});

// Configure view engine
app.engine('hbs', exphbsInstance.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
