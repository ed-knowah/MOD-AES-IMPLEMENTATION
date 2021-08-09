// In the case of high-quality block ciphers, such a small change in
// either the key or the plaintext should cause a drastic change in the
//  ciphertext. The actual term was first used by Horst Feistel,[1]
// although the concept dates back to at least Shannon's diffusion.

// In simple words,
// it quantifies the effect on the cipher-text
// with respect to the small change made in plaint text or the key.

let stringSimilarity = require("string-similarity");
let aes = require("../Aes");
let noahAes = require("../noahAes");

// NORMAL AES AVALANCHE EFFECT
const text = "this is a boy here";
const key = "1234";
const encr1 = aes.Ctr.encrypt(text, key, 256);
// console.log(`this the first cipher: ${encr1} `);

// after key changes
const key2 = "00234";
const encr2 = aes.Ctr.encrypt(text, key2, 256);
// console.log(
//   `this the second cipher after changing 1-bit of the key: ${encr2} `
// );

var similarity = stringSimilarity.compareTwoStrings(encr2, encr1);
//console.log(similarity * 100 + "%");

const percentageSimilarity1 = similarity * 100;
//console.log("similarity:" + percentageSimilarity1 + "%");
const diff1 = 100 - percentageSimilarity1;
console.log("normal AES difference:" + diff1 + "%");

// MODIFIED AES AVALANCHE EFFECT

const text_for_mod_aes = "this is a boy here";
const key_for_mod_aes = "1234";
const encr1_for_mod_aes = noahAes.Ctr.encrypt(
  text_for_mod_aes,
  key_for_mod_aes,
  256
);
const dec = noahAes.Ctr.decrypt(encr1_for_mod_aes, "1234", 256);
console.log(encr1_for_mod_aes);
console.log(dec);
// console.log(`this the first cipher: ${encr1} `);

// after key changes
const key2_for_mod_aes = "00234";
const encr2_for_mod_aes = noahAes.Ctr.encrypt(
  text_for_mod_aes,
  key2_for_mod_aes,
  256
);
// console.log(
//   `this the second cipher after changing 1-bit of the key: ${encr2} `
// );

var similarity2 = stringSimilarity.compareTwoStrings(
  encr2_for_mod_aes,
  encr1_for_mod_aes
);
const percentageSimilarity2 = similarity2 * 100;
//console.log("similarity:" + percentageSimilarity2 + "%");
const diff = 100 - percentageSimilarity2;
console.log("mod AES difference:" + diff + "%");
