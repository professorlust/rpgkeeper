//----------------------------------------------------------------------------------------------------------------------
// Some simple utility functions
//
// @module
//----------------------------------------------------------------------------------------------------------------------

const base62 = require('base62');
const uuid = require('uuid');

//----------------------------------------------------------------------------------------------------------------------

// This generates nice, short ids (ex: 'HrILY', '2JjA9s') that are as unique as a uuid.
function shortID()
{
    return base62.encode(new Buffer(uuid.v4(null, [])).readUInt32LE(0));
} // end shortID

//----------------------------------------------------------------------------------------------------------------------

module.exports = { shortID };

//----------------------------------------------------------------------------------------------------------------------