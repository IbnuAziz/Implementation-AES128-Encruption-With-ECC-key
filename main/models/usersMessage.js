var mongoose = require('mongoose');
var crypto = require('crypto');
var encDec = require('../../encANDdec');

var Schema = mongoose.Schema;

var userMessage = new Schema({
    kepada_message : {type : String, required: true},
    cc_message :{type : String, required: true},
    subjek_message : {type : String, required: true},
    text_message : {type : String, set: encDec.enc},
    createdAt : {type: Date, default:Date.now},
    updateAt : {type: Date, default:Date.now},
    dari :{
        type: Schema.Types.ObjectId, 
        ref: 'signup_users'
    },
    isRead : {type:Boolean, default:false},
    // get: decrypt, set: encrypt
}, {collection: 'message_users'});


var IV = crypto.randomBytes(16);

// initialization curve for alice and bob
const alice = crypto.createECDH('secp128r1');
alice.generateKeys();

const bob = crypto.createECDH('secp128r1');
bob.generateKeys();

// convert public keys of alice and bob to base64
const alicePublicKeyBase64 = alice.getPublicKey().toString('base64');
const bobPublicKeyBase64 = bob.getPublicKey().toString('base64');

// compute shared secret of alice and bob
const aliceSharedKey = alice.computeSecret(bobPublicKeyBase64, 'base64', 'hex');
const bobSharedKey = bob.computeSecret(alicePublicKeyBase64, 'base64', 'hex');

// check alice and bob shared key are equal
// console.log('isEqual? : ',aliceSharedKey === bobSharedKey);
// console.log('Alice shared key : ', aliceSharedKey);
// console.log('Bob shared key : ', bobSharedKey);

let auth_tag;
let encrypted;

function encrypt(MESSAGE) {
    const chiper = crypto.createCipheriv('aes-128-gcm', Buffer.from(aliceSharedKey, 'hex'), IV);
    
    encrypted = chiper.update(MESSAGE, 'utf8','hex');
    encrypted += chiper.final('hex');
    
    auth_tag = chiper.getAuthTag().toString('hex');

    console.table({
        IV: IV.toString('hex'),
        encrypted: encrypted,
        auth_tag: auth_tag
    });
    
    return encrypted.toString();
}

userMessage.statics.decrypt = function decrypt(MESSAGE) {
    if (MESSAGE === null || typeof MESSAGE === 'undefined') {console.log('No Message')};
    try {
        const func = encrypt();
        const dechiper = crypto.createDecipheriv('aes-128-gcm', Buffer.from(bobSharedKey, 'hex'), IV);
        
        dechiper.setAuthTag(Buffer.from(encrypt, 'hex'));
        
        // dechiper.setAuthTag(crypto.randomBytes(16));
        
        let decrypted = dechiper.update(encrypt, 'hex', 'utf8');
        decrypted += dechiper.final('utf8');
        
        // console.log("Decrypted Message : ", decrypted);

        return decrypted.toString('utf8');
        
        } catch (error) {
            console.log('Cannot retrive Data : '+error.message);
        }
    }


var usermessage = mongoose.model('message_data', userMessage);
module.exports = usermessage;