const crypto = require('crypto');
const algorithm = 'aes-128-gcm';
const iv = crypto.randomBytes(16);

let msg = 'a';


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
console.log('isEqual? : ',aliceSharedKey === bobSharedKey);
console.log('Alice shared key : ', aliceSharedKey);
console.log('Bob shared key : ', bobSharedKey);

let auth_tag;
let encrypted;

function encrypt(msg) {
        let chiper = crypto.createCipheriv(algorithm, Buffer.from(aliceSharedKey, 'hex'), iv);
        encrypted = chiper.update(msg, 'utf-8', 'hex');
        encrypted += chiper.final('hex');

        auth_tag = chiper.getAuthTag().toString('hex');

        console.table({
            IV: iv.toString('hex'),
            encrypted: encrypted,
            auth_tag: auth_tag
        });
        return encrypted.toString();
}

function decrypt(msg) {
    try {

        const dechiper = crypto.createDecipheriv(algorithm, Buffer.from(bobSharedKey, 'hex'), iv);
        
        dechiper.setAuthTag(Buffer.from(auth_tag, 'hex'));
        
        // dechiper.setAuthTag(crypto.randomBytes(16));
        
        let decrypted = dechiper.update(encrypted, 'hex', 'utf8');
        decrypted += dechiper.final('utf8');
        
        return decrypted.toString();
        
        } catch (error) {
            console.log(error.message);
        }
}

var test = encrypt(msg)
console.log('Encrypt : ' +test);
console.log('Decrypt : ' +decrypt(test));

module.exports = ({encrypt, decrypt});