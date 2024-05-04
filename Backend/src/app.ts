import express,{ Express, Request, Response } from 'express';
import rateLimit from 'express-rate-limit'

const app:Express = express();
const PORT = 3000;

app.use(express.json());


const otpLimiter =  rateLimit({
    windowMs:5*60*1000,
    max:3,
    message:"Too Many Request, please try again after 5 minutes",
    standardHeaders:true,
    legacyHeaders:false
});

const passwordResetLimiter = rateLimit({
    windowMs:15*60*1000,
    max:5,
    message:"Too many password reset attempts, please try again after 15 minutes",
    standardHeaders:true,
    legacyHeaders:false
})

const otpStore: Record<string,string>={};

app.post('/generate-otp',otpLimiter,async(req:Request,res:Response)=>{
    try {
        const email = req.body.email;

        if(!email){
            return res.status(400).json({message:"Email is required"});
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generates a 6-digit OTP
        otpStore[email] = otp;

        console.log(`OTP for ${email}: ${otp}`);
        
        return res.status(200).json({message:"OTP generated and logged"});
    } catch (error) {
        
    }
})

app.post('/reset-password',passwordResetLimiter,async(req:Request,res:Response)=>{
    try {
        const {email,otp,newPassword}= req.body;

        if(!email || !otp || !newPassword){
            return res.status(400).json({messgae:"Please check payload"});
        }

        if(otpStore[email] === otp){
            console.log(`Password for ${email} has been reset sucessfully`);
            delete otpStore[email];
            return res.status(200).json({message:"Password has been Resetted Successfully"});
        }else{
            console.log(otp)
            return res.status(401).json({message:"Invalid OTP"})
        }
    } catch (error) {
        console.log(error)
    }
})

app.listen(4000,()=>{
    console.log("Server is listening")
})