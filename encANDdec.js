const crypto = require('crypto');
const algorithm = 'aes-128-gcm';
const iv = crypto.randomBytes(16);

let msg = 'aku anak soleh';


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
        let chiper = crypto.createCipheriv(algorithm, Buffer.from(aliceSharedKey), iv);
        let encrypted = chiper.update(msg);
        encrypted = Buffer.concat([chiper.final()]);

        auth_tag = chiper.getAuthTag().toString('hex');

        return{
            IV: iv.toString('hex'),
            encrypted: encrypted.toString('hex')
            // auth_tag: auth_tag
        };
        // return encrypted.toString();
}

function decrypt(msg) {
    // try {
        let iv = Buffer.from(msg.iv, 'hex');
        let encryptedText = Buffer.from(msg.encrypted, 'hex');

        let dechiper = crypto.createDecipheriv(algorithm, Buffer.from(bobSharedKey), iv);
        
        // dechiper.setAuthTag(Buffer.from(auth_tag, 'hex'));
        
        // dechiper.setAuthTag(crypto.randomBytes(16));
        
        let decrypted = dechiper.update(encryptedText);
        decrypted = Buffer.concat([decrypted, dechiper.final()])
        
        return decrypted.toString();

        // } catch (error) {
        //     console.log(error.message);
    // }
}

var test = encrypt(msg)
console.log('Encrypt : ' +test);
console.log('Decrypt : ' +decrypt(test));

module.exports = ({encrypt, decrypt});