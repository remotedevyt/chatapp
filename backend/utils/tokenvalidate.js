const jwtutil = require('./jwt');
const validate = async (req,res,next) => {
    let token = null;
    // console.log(req.headers)
    if(req.headers.authorization){
        token = req.headers.authorization.replace('Bearer ','');
        let verify_ = await jwtutil.verify(token);
        if(verify_.data?.id){
            req.user = verify_.data
            next()
        }
        else{
            res.status(403).json({"message":"Invalid Token","error":verify_});
            return;
        }
        
    }
    else{
        res.status(403).json({"error":"No Auth Header"});
        return;
    }
}

module.exports = validate;