const mongoose = require('mongoose');


async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connect Success')
    } catch (error) {
        console.log('Connect Failue')
        // console.log('Error', error)
    }
}

module.exports = { connect };