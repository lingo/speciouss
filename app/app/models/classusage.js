'use strict';

module.exports = function(mongoose) {
    var Schema = mongoose.Schema;

    var ClassUseSchema   = new mongoose.Schema({
        element: 'string',
        parents: [],
        uri:     'string',
    });

	ClassUseSchema.index({ element: 1, uri: 1 });
    var ClassUse = mongoose.model('CSSClassUse', ClassUseSchema);

    return {
        model:  ClassUse,
        schema: ClassUseSchema
    };
};