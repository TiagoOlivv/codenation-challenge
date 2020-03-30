require('dotenv').config()
const axios = require('axios');
const fs = require('fs');
const sha1 = require('sha1');
const FormData = require('form-data');

function cipherCesar(str, num) {
    let output = '';
    for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode > 96 && charcode < 123) {
            let newcharcode = charcode - num;
            if (newcharcode < 97) {
                newcharcode = (122 - ((newcharcode - 96) * -1))
            }
            output += String.fromCharCode(newcharcode);
        } else {
            output += String.fromCharCode(charcode);
        }
    }
    return output;
}

axios.get(process.env.DATA_TOKEN)
  .then(request => {
    const { data } = request;
    const response = new FormData();
    data.decifrado = cipherCesar(data.cifrado, data.numero_casas);
    data.resumo_criptografico = sha1(data.decifrado);
    fs.writeFileSync("answer.json", JSON.stringify(data));    
    response.append('answer', fs.createReadStream('answer.json'));
    return axios.post(process.env.SOLUTION_TOKEN,
    	response,
    	{ 
            headers: response.getHeaders() 
        }
    )
  })