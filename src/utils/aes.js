const CryptoJS = require('crypto-js') //引用AES源码js
const key = CryptoJS.enc.Utf8.parse('dRPzT9y0v87FKOqtNEFaSs6d0bYBhwPa') //十六位十六进制数作为密钥 

//解密方法
export function Decrypt(data) {
    const decrypted = CryptoJS.AES.decrypt(data, key, {
        iv: key,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return  CryptoJS.enc.Utf8.stringify(decrypted) 
}

//加密方法
export function Encrypt(data) {
    let srcs = CryptoJS.enc.Utf8.parse(data)
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: key,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
} 