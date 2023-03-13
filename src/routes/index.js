const newsRouter = require('./news');
const meRouter = require('./me');
const siteRouter = require('./site');
const coursesRouter = require('./courses');
const authRouter = require('./auth');
const userRouter = require('./user');

function route(app) {
    app.use('/news', newsRouter);
    app.use('/me', meRouter);
    app.use('/courses', coursesRouter);
    app.use('/', siteRouter);
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
}

module.exports = route;
