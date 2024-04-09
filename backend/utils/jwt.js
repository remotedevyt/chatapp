var jwt = require('jsonwebtoken');
const privatekey = 'secretKey';

const create = async (data) => {
    try{
        return await jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 1), // 1 Minute Expiry
            data: data
          }, privatekey);
    } catch(err){
        return err
    }
}

const verify = async (token) => {
    try{
        return await jwt.verify(token, privatekey);
    }
    catch (err){
        return err
    }
}

module.exports = {create,verify}