var crypto = require('crypto');


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

const IV_LENGTH = 16;

function encrypt(plaintext) {
    try {
    var IV = crypto.randomBytes(IV_LENGTH).toString('hex')

    var chiper = crypto.createCipheriv('aes-128-gcm', Buffer.from(aliceSharedKey, 'hex'), IV);

    var encrypted = chiper.update(plaintext, 'utf8','hex');
    encrypted += chiper.final('hex');

    var tag = chiper.getAuthTag().toString('hex');

    return "".concat(IV, tag, encrypted);
    }catch(error){
        console.log('No Encrypted: ', error)
    }
}

function decrypt(ciphertext) {
    try {
        var Ddata = ciphertext;

        var iv = Ddata.slice(0, 32),
        tag = Ddata.slice(32, 64),
        text = Ddata.slice(64);
        
        var dechiper = crypto.createDecipheriv('aes-128-gcm', Buffer.from(bobSharedKey, 'hex'), iv);
        
        dechiper.setAuthTag(Buffer.from(tag, 'hex'));
    
        var buff = [];
        var decrypted = dechiper.update(text, 'hex', 'utf8');

        buff.push(decrypted);
        buff.push(dechiper.final('utf8'));
        return buff.join('').replace(/^"(.*)"$/, '$1');

    } catch (error) {
        console.log('No Decrypted: ', error)
    }
}

module.exports = { enc: encrypt, dec: decrypt};