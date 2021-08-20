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
        // random initialization vector
        var iv = crypto.randomBytes(IV_LENGTH);

        // AES 128 GCM Mode
        var cipher = crypto.createCipheriv('aes-128-gcm', Buffer.from(aliceSharedKey, 'hex'), iv);

        // encrypt the given text
        var encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);

        // extract the auth tag
        var tag = cipher.getAuthTag();

        // generate output
        return Buffer.concat([iv, tag, encrypted]).toString('hex');

    }catch(e){
        console.log('cannot encrpt: ', e)
    }
}

function decrypt(ciphertext) {
    try {
        // hex decoding
        var bData = Buffer.from(ciphertext, 'hex');

        // convert data to buffers
        let iv = bData.slice(0, 16);
        let tag = bData.slice(16, 32);
        let text = bData.slice(32);

        // AES 128 GCM Mode
        var decipher = crypto.createDecipheriv('aes-128-gcm', Buffer.from(bobSharedKey, 'hex'), iv);
        decipher.setAuthTag(Buffer.from(tag, 'hex'));

        // encrypt the given text
        /* var decrypted = Buffer.concat([decipher.update(text,'binary' ,'utf8'), decipher.final()]); */
        var decrypted = decipher.update(text, 'hex', 'utf8'); 
        decrypted += decipher.final('utf8');

        return decrypted.replace(/^"(.*)"$/, '$1');

    }catch(e){
        console.log('cannot decrypt : ', e)
    }
}

module.exports = { enc: encrypt, dec: decrypt};