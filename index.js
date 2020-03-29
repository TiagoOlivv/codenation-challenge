require('dotenv').config()

const axios = require('axios');
const fs = require('fs');
const sha1 = require('sha1');
const FormData = require('form-data');

function cipherCesar(str, num) {
    
    if (num > 26 || num < 0) return null;

    if (num === 0) return str;

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

    console.log('-- Gerando arquivo answer.json');
    fs.writeFileSync("answer.json", JSON.stringify(data));
    console.table(data);

    console.log('\n-- Decifrando o texto cifrado');
    data.decifrado = cipherCesar(data.cifrado, data.numero_casas);
    fs.writeFileSync("answer.json", JSON.stringify(data));
    console.table(data);

    console.log('\n-- Gerando resumo criptografico do texto decifrado usando algoritmo sha1');
    data.resumo_criptografico = sha1(data.decifrado);
    fs.writeFileSync("answer.json", JSON.stringify(data));    
    console.table(data);

    console.log('\n-- Submetendo arquivo atualizado');
    const response = new FormData();
    response.append('answer', fs.createReadStream('answer.json'));
    
    return axios.post(process.env.SOLUTION_TOKEN,
    	response,
    	{ headers: response.getHeaders() }
    ).then(() => {
    	console.log('Arquivo submetido com sucesso!');
    }).catch(err => {
    	console.log('Houve um erro ao submeter o arquivo.');
    })
  })

