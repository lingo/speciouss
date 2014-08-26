'use strict';

module.exports = function(mongoose) {
    var Schema = mongoose.Schema;

    var classUsage = require('./classusage');

    var CSSClassSchema   = new mongoose.Schema({
        className: 'string',
        uses:      [classUsage.schema]
    });

    var CSSClass = mongoose.model('CSSClass', CSSClassSchema);

    return {
        model:  CSSClass,
        schema: CSSClassSchema
    };
};