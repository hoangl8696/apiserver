const schemas = require('./schemas');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

for (const collectionName in schemas) {
    const schema = schemas[collectionName];
    if (schema instanceof mongoose.Schema) {
        const model = mongoose.model(collectionName, schema);
        module.exports[collectionName] = model;
        model.on('index', (err) => {
            if (err) {
                console.log('indexing error on %s: %s', collectionName, err);
            }
        }); 
    }
}