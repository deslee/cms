import { createServer } from './server'

const PORT = process.env.PORT || 4000

createServer()
    .then(app => {
        app.listen(PORT, function() {
            console.log('app built, listening to ' + PORT)
        });
    })
    .catch(err => {
        console.error(err);
    });