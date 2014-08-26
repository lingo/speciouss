'use strict';

module.exports = function(mongoose) {
    var Schema = mongoose.Schema;

    var ClassUseSchema   = new mongoose.Schema({
        element: 'string',
        uri:     'string'
    });

    var ClassUse = mongoose.model('CSSClassUse', ClassUseSchema);

    return {
        model:  ClassUse,
        schema: ClassUseSchema
    };
};