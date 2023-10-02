import CryptoJS from 'crypto-js';

export const decryptData = (encryptedData: string) => {
  if (process.env.REACT_APP_NOT_SECRET_CODE === undefined) {
    throw new Error('REACT_APP_NOT_SECRET_CODE is undefined');
  }
  const decryptedData = CryptoJS.AES.decrypt(encryptedData, process.env.REACT_APP_NOT_SECRET_CODE).toString(CryptoJS.enc.Utf8);
  return decryptedData;
};

export const encryptData = (dataToEncrypt: string, secretKey: string) => {
  const encryptedData = CryptoJS.AES.encrypt(dataToEncrypt, secretKey).toString();
  return encryptedData;
};
