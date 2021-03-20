// const express = require('express')
const path = require('path')
//const PORT = process.env.PORT || 5000

//express()
//  .use(express.static(path.join(__dirname, 'public')))
//  .set('views', path.join(__dirname, 'views'))
//  .set('view engine', 'ejs')
//  .get('/', (req, res) => res.render('pages/index'))
//  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  
  const express = require('express');
  const app = express();
  const MongoClient = require('mongodb').MongoClient;
  //var MongoClient = require('mongoose');
  const assert = require('assert');
  const bodyParser = require('body-parser');
  
  let db = null;
  const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://127.0.0.1:5000';
  const url = process.env.MONGODB_URL || 'mongodb://localhost:27017';  
  const dbName = 'chatbotsdb';
  
  const jsonParser = bodyParser.json();
  const urlencodedParser  = bodyParser.urlencoded({extented: false});

  app.use(jsonParser);
  app.use(urlencodedParser );
  app.use('/css', express.static(__dirname + '/css'));
  app.use('/css', express.static(__dirname + '/css/bootstrap-4.5.3-dist'));
  app.use('/js', express.static(__dirname + '/js'));
  app.use('/js', express.static(__dirname + '/js/jquery-3.5.1'));
  app.use('/js', express.static(__dirname + '/js/bootstrap-4.5.3-dist'));
  
  
  MongoClient.connect(url, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, client){
      assert.equal(null, err);
      console.log('banco de dados conectado com sucesso!');
  
      db = client.db(dbName);
  
  });
  
  //app.listen(3000);
  const PORTA = process.env.PORT || 3000;
  //const PORT  = process.env.PORT || 3000;
  
  //app.use(express.static(path.join(__dirname, 'public')))
  //.set('views', path.join(__dirname, 'views'))
  //.set('view engine', 'ejs')
  //.get('/', (req, res) => res.render('pages/index'))
  
  app.listen(PORTA, () => console.log(`Listening on ${ PORTA }`));

  
  console.log('servidor rodando em localhost:3000');

//INTERFACE #########################################################################
app.get('/', urlencodedParser , function(req, res) {
    try{
        res.set('Content-Type', 'text/html');        
	    const fs = require('fs');
	    const data = fs.readFileSync('./home.html', 'utf8');
	    res.send(data);   
    }catch(e){
        console.log('erro de requisicao #1');
    }    
});
app.get('/home', urlencodedParser , function(req, res) {
    try{
        res.set('Content-Type', 'text/html');        
	    const fs = require('fs');
	    const data = fs.readFileSync('./home.html', 'utf8');
	    res.send(data);   
    }catch(e){
        console.log('erro de requisicao #1');
    }    
});
// Inicio - Admin ----------------
app.get('/admin', urlencodedParser , function(req, res) {
    try{
        res.set('Content-Type', 'text/html');        
	    const fs = require('fs');
	    const data = fs.readFileSync('./admin.html', 'utf8');
        res.send(data);
    }catch(e){
        console.log('erro de requisicao #2');
    } 
});
app.post('/admin/search', urlencodedParser , function(req, res) {
	let objJSON = {};
	if(req.body.user_name) objJSON.user_name = req.body.user_name; 
	else objJSON.user_name = false;
	if(req.body.password) objJSON.password = req.body.password; 
    else objJSON.password = false;
    
	findAdmin(objJSON, function(result) {
        if(result) res.send(result);
        else res.send({user_name: false, password: false});
	});
});
const findAdmin = function(objJSON, callback) {
	const collection = db.collection('admin');
	collection.findOne(objJSON, function(err, result) {
		assert.equal(null, err);
		callback(result);
	})
}

// Fim - Admin ----------------

app.get('/login', urlencodedParser , function(req, res) {
    res.set('Content-Type', 'text/html');        
	const fs = require('fs');
	const data = fs.readFileSync('./login.html', 'utf8');
	res.send(data);
});
app.get('/index', urlencodedParser , function(req, res) {        
	let objJSON = {};
	if(req.query.user_name) objJSON.user_name = req.query.user_name; 
	else objJSON.user_name = false;
	if(req.query.password) objJSON.password = req.query.password; 
	else objJSON.password = false;

	findUserOne(objJSON, function(result) {
		if((result)&&(result.activate==1)) {
            let code_user = Number(result.code_user);
            res.set('Content-Type', 'text/html');                                    
			const fs = require('fs');
            let data = fs.readFileSync('./index.html', 'utf8');  
            data = data.replace('[code_user]', code_user);
            data = data.replace('[code_user]', code_user);
            data = data.replace('[code_user]', code_user);
            data = data.replace('[code_user]', code_user);
            data = data.replace('[CHATBOT_API_URL]', CHATBOT_API_URL);            
            
			res.send(data);	
		}else {
            res.set('Content-Type', 'text/html');                        
			const fs = require('fs');
			const data = fs.readFileSync('./login.html', 'utf8');
			res.send(data);
		}
	});
});
app.post('/user/search', urlencodedParser , function(req, res) {
	let objJSON = {};
	if(req.body.user_name) objJSON.user_name = req.body.user_name; 
	else objJSON.user_name = false;
	if(req.body.password) objJSON.password = req.body.password; 
	else objJSON.password = false;

	findUserOne(objJSON, function(result) {
		res.send(result);
	});
});
const findUserOne = function(objJSON, callback) {
	const collection = db.collection('user');
	collection.findOne(objJSON, function(err, result) {
		assert.equal(null, err);
		callback(result);
	})
}



app.post('/documentos/find', urlencodedParser , function(req, res) {
	let objJSON = {};
	if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); 
	else objJSON.code_user = -1;
	if(req.body.activate) objJSON.activate = Number(req.body.activate); 
	else objJSON.activate = 1;    
	findDocumentos(objJSON, function(result) {
		res.send(result);
	});
});
const findDocumentos = function(objJSON, callback) {
	const collection = db.collection('documentos');
	collection.find(objJSON).toArray(function(err, result) {
		assert.equal(null, err);
		callback(result);
	});
}
// Janela do Chatbot
app.get('/chatbot', urlencodedParser , function(req, res) {
    let objJSON = {};
    let code_user = -1;    
    if(req.query.code_user){
        code_user = Number(req.query.code_user);
        objJSON.code_user = code_user;
    } 
    
    res.set('Content-Type', 'text/html');        
	const fs = require('fs');
    let data = fs.readFileSync('./chatbot.html', 'utf8');    
    data = data.replace('[code_user]', code_user);
    data = data.replace('[CHATBOT_API_URL]', CHATBOT_API_URL);
	res.send(data);

});



//###################################################################################

//----------- USUARIOS --------->>

app.post('/user/insert', urlencodedParser , function(req, res){
    let objJSON = {};
    if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); else objJSON.code_user = gerarCodigo();
    if(req.body.activate) objJSON.activate = Number(req.body.activate); else objJSON.activate = 1;
    if(req.body.full_name) objJSON.full_name = req.body.full_name; else objJSON.full_name = '';
    if(req.body.user_name) objJSON.user_name = req.body.user_name; else objJSON.user_name = '';
    if(req.body.email) objJSON.email = req.body.email; else objJSON.email = '';
    if(req.body.password) objJSON.password = req.body.password; else objJSON.password = '';

    insertUser(objJSON, function(result){
        res.send(result);
    })
});

app.post('/user/update', urlencodedParser , function(req, res){
    let objJSON = {};
    if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
    if(req.body.activate) objJSON.activate = Number(req.body.activate);
    if(req.body.full_name) objJSON.full_name = req.body.full_name;
    if(req.body.full_name) objJSON.full_name = req.body.full_name;
    if(req.body.user_name) objJSON.user_name = req.body.user_name;
    if(req.body.email) objJSON.email = req.body.email;
    if(req.body.password) objJSON.password = req.body.password;

    updateUser(objJSON, function(result){
        res.send(result);
    })
});

app.post('/user/delete', urlencodedParser , function(req, res){
    let objJSON = {};
    if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
    if(req.body.activate) objJSON.activate = Number(req.body.activate);
    if(req.body.full_name) objJSON.full_name = req.body.full_name;
    if(req.body.full_name) objJSON.full_name = req.body.full_name;
    if(req.body.user_name) objJSON.user_name = req.body.user_name;
    if(req.body.email) objJSON.email = req.body.email;
    if(req.body.password) objJSON.password = req.body.password;

    deleteUser(objJSON, function(result){
        res.send(result);
    })
});

app.post('/user/find', urlencodedParser , function(req, res){
    let objJSON = {};
    if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
    if(req.body.activate) objJSON.activate = Number(req.body.activate);
    if(req.body.full_name) objJSON.full_name = req.body.full_name;
    if(req.body.full_name) objJSON.full_name = req.body.full_name;
    if(req.body.user_name) objJSON.user_name = req.body.user_name;
    if(req.body.email) objJSON.email = req.body.email;
    if(req.body.password) objJSON.password = req.body.password;

    findUser(objJSON, function(result){
        res.send(result);
    })
});

app.post('/user/activate/true', urlencodedParser , function(req, res){
    let objJSON = {};
    if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); else objJSON.code_user = 0;

    activateUserTrue(objJSON, function(result){
        res.send(result);
    })
});

app.post('/user/activate/false', urlencodedParser , function(req, res){
    let objJSON = {};
    if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); else objJSON.code_user = 0;   

    activateUserFalse(objJSON, function(result){
        res.send(result);
    })
});

app.post('/user/delete/all', urlencodedParser , function(req, res){
    let objJSON = {};
    if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); else objJSON.code_user = 0;  

    deleteUserAll(objJSON, function(result){
        res.send(result);
    })
});

const insertUser = function(objJSON, callbackFunction){
    const collection = db.collection('user');
    collection.insertOne(objJSON, function(err, result){
        assert.equal(null, err);
        callbackFunction(result);
    });
}

const updateUser = function(objJSON, callbackFunction){
    const collection = db.collection('user');
    const code_user = Number(objJSON.code_user);
    collection.updateOne({code_user: code_user}, {$set: objJSON}, function(err, result){
        assert.equal(null, err);        
        callbackFunction(result);
    });
}

const deleteUser = function(objJSON, callbackFunction){
    const collection = db.collection('user');    
    collection.deleteOne(objJSON, function(err, result){
        assert.equal(null, err);
        callbackFunction(result);
    });
}

const findUser = function(objJSON, callbackFunction){
    const collection = db.collection('user');
    collection.find(objJSON).toArray(function(err, result){
        assert.equal(null, err);
        callbackFunction(result);
    });
}

const activateUserTrue = function(objJSON, callbackFunction){
    const code_user = Number(objJSON.code_user);
    
    const collectionUser = db.collection('user');
    collectionUser.updateOne({code_user: code_user}, {$set: {activate: 1}});

    const collectionDocuments = db.collection('documentos');
    collectionDocuments.updateMany({code_user: code_user}, {$set: {activate: 1}});

    const collectionBot = db.collection('chatbot');
    collectionBot.updateMany({code_user: code_user}, {$set: {activate: 1}}, function(err, result){
        assert.equal(null, err);        
        callbackFunction(result);
    });
}

const activateUserFalse = function(objJSON, callbackFunction){
    const code_user = Number(objJSON.code_user);
    
    const collectionUser = db.collection('user');
    collectionUser.updateOne({code_user: code_user}, {$set: {activate: 0}});

    const collectionDocuments = db.collection('documentos');
    collectionDocuments.updateMany({code_user: code_user}, {$set: {activate: 0}});

    const collectionBot = db.collection('chatbot');
    collectionBot.updateMany({code_user: code_user}, {$set: {activate: 0}}, function(err, result){
        assert.equal(null, err);        
        callbackFunction(result);
    });
}

const deleteUserAll = function(objJSON, callbackFunction){
    const collection = db.collection('chatbot');    
    collection.deleteMany(objJSON, function(err, result){
        assert.equal(null, err);
        callbackFunction(result);
    });
}

//----------- CHATBOT --------->>

app.post('/chatbot/insert', urlencodedParser , function(req, res){
    let objJSON = {};
    if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); else objJSON.code_user = 0;
    if(req.body.activate) objJSON.activate = Number(req.body.activate); else objJSON.activate = 1;
    if(req.body.code_session) objJSON.code_session = Number(req.body.code_session); else objJSON.code_session = 0;
    if(req.body.code_current) objJSON.code_current = Number(req.body.code_current); else objJSON.code_current = gerarCodigo();
    if(req.body.code_relation) objJSON.code_relation = Number(req.body.code_relation); else objJSON.code_relation = 0;
    if(req.body.code_before) objJSON.code_before = Number(req.body.code_before) ; else objJSON.code_before = 0;
    if(req.body.input) objJSON.input = req.body.input ; else objJSON.input = '';
    if(req.body.output) objJSON.output = req.body.output ; else objJSON.output = 'desculpe, mas não entendi.';

    insertData(objJSON, function(result){
        res.send(result);
    })
});


app.post('/chatbot/update', urlencodedParser , function(req, res){
    let objJSON = {};
    if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
    if(req.body.activate) objJSON.activate = Number(req.body.activate);
    if(req.body.code_session) objJSON.code_session = Number(req.body.code_session);
    if(req.body.code_current) objJSON.code_current = Number(req.body.code_current);
    if(req.body.code_relation) objJSON.code_relation = Number(req.body.code_relation);
    if(req.body.code_before) objJSON.code_before = Number(req.body.code_before);
    if(req.body.input) objJSON.input = req.body.input;
    if(req.body.output) objJSON.output = req.body.output;

    updateData(objJSON, function(result){
        res.send(result);
    })
});

app.post('/chatbot/delete', urlencodedParser , function(req, res){
    let objJSON = {};
    if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
    if(req.body.activate) objJSON.activate = Number(req.body.activate);
    if(req.body.code_session) objJSON.code_session = Number(req.body.code_session);
    if(req.body.code_current) objJSON.code_current = Number(req.body.code_current);
    if(req.body.code_relation) objJSON.code_relation = Number(req.body.code_relation);
    if(req.body.code_before) objJSON.code_before = Number(req.body.code_before);
    if(req.body.input) objJSON.input = req.body.input;
    if(req.body.output) objJSON.output = req.body.output;

    deleteData(objJSON, function(result){
        res.send(result);
    })
});

app.post('/chatbot/find', urlencodedParser , function(req, res){
    let objJSON = {};
    if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
    if(req.body.activate) objJSON.activate = Number(req.body.activate);
    if(req.body.code_session) objJSON.code_session = Number(req.body.code_session);
    if(req.body.code_current) objJSON.code_current = Number(req.body.code_current);
    if(req.body.code_relation) objJSON.code_relation = Number(req.body.code_relation);
    if(req.body.code_before) objJSON.code_before = Number(req.body.code_before);
    if(req.body.input) objJSON.input = req.body.input;
    if(req.body.output) objJSON.output = req.body.output;

    findData(objJSON, function(result){
        res.send(result);
    })
});

function gerarCodigo(){
    const data = new Date();
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const dia = data.getDay();
    const hora = data.getHours();
    const minuto = data.getMinutes();
    const segundo = data.getSeconds();
    const milisegundos = data.getMilliseconds();

    const result = Number(parseFloat(Number(ano +''+ mes +''+ dia +''+ hora +''+ minuto +''+ segundo +''+ milisegundos)/2).toFixed(0));
    return result;
}

const insertData = function(objJSON, callbackFunction){
    const collection = db.collection('chatbot');
    collection.insertOne(objJSON, function(err, result){
        assert.equal(null, err);
        callbackFunction(result);
    });
}

const updateData = function(objJSON, callbackFunction){
    const collection = db.collection('chatbot');
    const code_current = Number(objJSON.code_current);
    collection.updateOne({code_current: code_current}, {$set: objJSON}, function(err, result){
        assert.equal(null, err);        
        callbackFunction(result);
    });
}

const deleteData = function(objJSON, callbackFunction){
    const collection = db.collection('chatbot');    
    collection.deleteOne(objJSON, function(err, result){
        assert.equal(null, err);
        callbackFunction(result);
    });
}

const findData = function(objJSON, callbackFunction){
    const collection = db.collection('chatbot');
    collection.find(objJSON).toArray(function(err, result){
        assert.equal(null, err);
        callbackFunction(result);
    });
}

app.get('/chatbot/question', urlencodedParser , function(req, res){
    let objJSON = {};
    if(req.query.code_user) objJSON.code_user = Number(req.query.code_user); else objJSON.code_user = 0;
    if(req.query.activate) objJSON.activate = Number(req.query.activate); else objJSON.activate = 1;
    if(req.query.code_session) objJSON.code_session = Number(req.query.code_session); else objJSON.code_session = 0;
    if(req.query.code_before) objJSON.code_before = Number(req.query.code_before); else objJSON.code_before = 0;
    if(req.query.input) objJSON.input = req.query.input; else objJSON.input = '';

    questionData(objJSON, function(result){
        res.send(result);
    })

})

const questionData = function(objJSON, callbackFunction){   

    const collection = db.collection('chatbot');
    collection.find(objJSON).toArray(function(err, result){
        assert.equal(null, err);
        if(result.length <= 0){
            let code_before = Number(objJSON.code_before);
            let objFind = {};
            if(code_before > 0){
                objFind = {
                    code_user: Number(objJSON.code_user),
                    code_relation: code_before
                }                
            }else{
                objFind = {code_user: objJSON.code_user};
            }
            collection.find(objFind).toArray(function(err, result){
                assert.equal(null, err);
                if(result.length <= 0){
                    const questionUser = getAbreviacoes(objJSON.input);
                    collection.find({code_user: Number(objJSON.code_user)}).toArray(function(err, result){
                        result = nlp(questionUser, result, objJSON.code_user);
                        callbackFunction(result);                    
                    });
                }else{
                    const questionUser = getAbreviacoes(objJSON.input);
                    result = nlp(questionUser, result, objJSON.code_user);
                    callbackFunction(result);
                }
            });
        }else callbackFunction(result);
    });
}

const getAbreviacoes = function(Input='') {
	try {
		Input = Input.toString().trim();
		let result = Input.replace(/ vc /g, 'você');
		result = result.replace(/ tb /g, 'também');
		result = result.replace(/ oq /g, 'o que');
		result = result.replace(/ dq /g, 'de que');
		result = result.replace(/ td /g, 'tudo');
		result = result.replace(/ pq /g, 'por quê');
		result.toString().trim();
		return result;
	}catch(e) {
		return Input;
		console.log({error: 'erro de requisição 35'});
	}
}

const nlp = function(question='', sentencas=[], code_user = -1){
    let originalQuestion = question.toString().trim();
    try{
        let findInput = 0;
        let findIndex = 0;

        let documentos = getDocumentos(originalQuestion, code_user);

        if(documentos){
            return  [{
                "_id": 0,
                "code_user": code_user,
                "activate": 1,
                "code_session": -1,
                "code_current": -1,
                "code_relation": -1,
                "code_before": -1,
                "input": originalQuestion,
                "output": "Ok, entendido."
            }];
        }else{

            for(let i=0; i<sentencas.length; i++){
                question = question.toString().trim();
                let input = sentencas[i].input.toString().trim();
                if(input.length <= 0) input = sentencas[i].output.toString().trim();
                
                // Tipos de Normalização NFD e NFKD:
                // --> https://www.ramosdainformatica.com.br/programacao/javascript/entenda-o-que-e-normalizacao-no-javascript/
                // --> https://qastack.com.br/programming/7931204/what-is-normalized-utf-8-all-about
                // --> https://www.otaviomiranda.com.br/2020/normalizacao-unicode-em-python/
                question = question.normalize('NFD').replace('/[\u0300-\u036f]/g', '').toLowerCase();
                input = input.normalize('NFD').replace('/[\u0300-\u036f]/g', '').toLowerCase();

                question = question.replace('-', ' ');
                question = question.replace('.', ' ');
                question = question.replace(',', ' ');
                question = question.replace('  ', ' ');
                question = question.replace(/[^a-zA-Z0-9\s]/g, '');
                input = input.replace(/[^a-zA-Z0-9\s]/g, '');

                let tokenizationQuestion = question.split(' ');
                let tokenizationInput = input.split(' ');

                tokenizationQuestion = tokenizationQuestion.map(function(e){
                    if(e.length>3) return e.substring(0, e.length-3); else return e;
                });

                tokenizationInput = tokenizationInput.map(function(e){
                    if(e.length>3) return e.substring(0, e.length-3); else return e;
                });

                let words = 0;
                for(let x=0; x < tokenizationQuestion.length; x++){            
                    if(tokenizationInput.indexOf(tokenizationQuestion[x]) >=0 ) words++;
                }
                if(words > findInput){
                    findInput = words;
                    findIndex = i;

                }
            }

            if(findInput > 0) return [{
                "_id": sentencas[findIndex]._id,
                "code_user": sentencas[findIndex].code_user,
                "activate": sentencas[findIndex].activate,
                "code_session": sentencas[findIndex].code_session,
                "code_current": sentencas[findIndex].code_current,
                "code_relation": sentencas[findIndex].code_relation,
                "code_before": sentencas[findIndex].code_before,
                "input": originalQuestion, //sentencas[findIndex].input,
                "output": sentencas[findIndex].output
            }];
            else return  [{
                "_id": 0,
                "code_user": sentencas[findIndex].code_user,
                "activate": sentencas[findIndex].activate,
                "code_session": sentencas[findIndex].code_session,
                "code_current": sentencas[findIndex].code_current,
                "code_relation": sentencas[findIndex].code_relation,
                "code_before": sentencas[findIndex].code_before,
                "input": originalQuestion,
                "output": "Desculpe, mas não entendi."
            }];

        }
    }catch(erro){
        return  [{
            "_id": 0,
            "code_user": code_user,
            "activate": 0,
            "code_session": 0,
            "code_current": 0,
            "code_relation": 0,
            "code_before": 0,
            "input": originalQuestion,
            "output": "Erro encontrado."
        }];
    }
}

const getDocumentos = function(question = '', code_user = -1){
    question = question.toString().trim();
    
    let _nome = getName(question);
    let _idade = getIdade(question);
    let _email = '';
    let _celular ='';
    let _telefone = '';
    let _cep = '';
    let _endereco = getEndereco(question);
    let _bairro = getBairro(question);
    let _numero = '';
    let _cpf = '';
    let _cnpj = '';

    const questionTokens = question.split(' ');
    for(let posicao = 0; posicao < questionTokens.length; posicao++){
        let palavra = questionTokens[posicao].toString().trim();

        if(palavra.length >= 1){
            if(_email.length <= 0) _email = getEmail(palavra);
            if(_celular.length <= 0) _celular = getCelular(palavra);
            if(_telefone.length <= 0) _telefone = getTelefoneFixo(palavra);
            if(_cep.length <= 0) _cep = getCEP(palavra);
            if(_numero.length <= 0) _numero = getNumero(palavra, question);
            if(_cpf.length <= 0) _cpf = getCPF(palavra);
            if(_cnpj.length <= 0) _cnpj = getCNPJ(palavra);
        }
    }

    let objJSON = {};
    if(code_user > 0) objJSON.code_user = code_user; else objJSON.code_user = -1;       
    if(_nome.length > 0) objJSON.nome = _nome; else objJSON.nome = '';
    if(_idade.length > 0) objJSON.idade = Number(_idade); else objJSON.idade = '';
    if(_email.length > 0) objJSON.email = _email; else objJSON.email = '';
    if(_celular.length > 0) objJSON.celular = Number(_celular); else objJSON.celular = '';
    if(_telefone.length > 0) objJSON.telefone = Number(_telefone); else objJSON.telefone = '';
    if(_cep.length > 0) objJSON.cep = Number(_cep); else objJSON.cep = '';
    if(_endereco.length > 0) objJSON.endereco = _endereco; else objJSON.endereco = '';
    if(_bairro.length > 0) objJSON.bairro = _bairro; else objJSON.bairro = '';
    if(_numero.length > 0) objJSON.numero = Number(_numero); else objJSON.numero = '';
    if(_cpf.length > 0) objJSON.cpf = Number(_cpf); else objJSON.cpf = '';
    if(_cnpj.length > 0) objJSON.cnpj = Number(_cnpj); else objJSON.cnpj = '';
    objJSON.activate = 1;

    if((_nome.length > 0) 
    || (_idade.length > 0)
    || (_email.length > 0)
    || (_celular.length > 0)
    || (_telefone.length > 0)
    || (_cep.length > 0)
    || (_endereco.length > 0)
    || (_bairro.length > 0)
    || (_numero.length > 0)
    || (_cpf.length > 0)
    || (_cnpj.length > 0)){
        const collection = db.collection('documentos');
        collection.insertOne(objJSON);
        return true;
    }else return false;
}

const defaultName = function(question = ''){
    let nome = '';
    const fs = require('fs');
    const data = fs.readFileSync('./names.csv', 'utf8');
    const names = data.toString().trim().split(',');
    let tempName = '';
    let tempIndex = Infinity;
    for(let i = 0; i < names.length; i++){
        let name = names[i].toString().trim();
        let indexStart = question.indexOf(name);

        if(question.indexOf(name) >= 0){
            if((name != tempName) && (indexStart < tempIndex)){
                tempName = name;
                tempIndex = indexStart;
                    
                let index1 = question.indexOf(' e '); if((index1 < 0) || (index1 < indexStart)) index1 = Infinity;
                let index2 = question.indexOf(' é '); if((index2 < 0) || (index2 < indexStart)) index2 = Infinity;
                let index3 = question.indexOf(','); if((index3 < 0) || (index3 < indexStart)) index3 = Infinity;
                let index4 = question.indexOf(';'); if((index4 < 0) || (index4 < indexStart)) index4 = Infinity;
                let index5 = question.indexOf('.'); if((index5 < 0) || (index5 < indexStart)) index5 = Infinity;

                let indexEnd = [
                    Math.abs(index1 - indexStart),
                    Math.abs(index2 - indexStart),
                    Math.abs(index3 - indexStart),
                    Math.abs(index4 - indexStart),
                    Math.abs(index5 - indexStart)
                ].sort((a, b) => a - b)[0] + indexStart;
                
                if(indexEnd < indexStart) indexEnd = question.length;        
                if(indexEnd < 0) indexEnd = question.length;
                nome = question.substring(indexStart, indexEnd);
                nome = nome.replace(/é/g, '');
                nome = nome.replace(/:/g, '');
                nome = nome.replace(/[0-9]]/g, '').trim();

                if(nome.indexOf(' e ') > 0){                    
                    nome = nome.split(' e ');
                    nome = nome[0].toString().trim();

                }

                if(nome.indexOf(' é ') > 0){                    
                    nome = nome.split(' é ');
                    nome = nome[0].toString().trim();
    
                }                

                if(nome.indexOf(', ') > 0){
                    nome = nome.split(', ');
                    nome = nome[0].toString().trim();

                }

                if(nome.indexOf('; ') > 0){
                    nome = nome.split('; ');
                    nome = nome[0].toString().trim();

                }

                if(nome.indexOf('. ') > 0){
                    nome = nome.split('. ');
                    nome = nome[0].toString().trim();

                }
            }            
        }
    }
    return nome.trim();
}


const getName = function(question = ''){
    question = question.toString().trim();

    let nome = '';
    let nomeDefault = defaultName(question);
    if(nomeDefault.length > 0){
        nome = nomeDefault;
    }else{
        let start = '';
        if(question.indexOf('Nome') >= 0 ) start = 'Nome';
        if(question.indexOf('nome') >= 0 ) start = 'nome';
        if(question.indexOf('chamo') >= 0 ) start = 'chamo';
        
        if((start.length > 0) && (question.indexOf('seu') < 0)){
            let indexStart = question.indexOf(start) + start.length + 1;
                    
            let index1 = question.indexOf(' e '); if((index1 < 0) || (index1 < indexStart)) index1 = Infinity;
            let index2 = question.indexOf(' é '); if((index2 < 0) || (index2 < indexStart)) index2 = Infinity;
            let index3 = question.indexOf(','); if((index3 < 0) || (index3 < indexStart)) index3 = Infinity;
            let index4 = question.indexOf(';'); if((index4 < 0) || (index4 < indexStart)) index4 = Infinity;
            let index5 = question.indexOf('.'); if((index5 < 0) || (index5 < indexStart)) index5 = Infinity;

            let indexEnd = [
                Math.abs(index1 - indexStart),
                Math.abs(index2 - indexStart),
                Math.abs(index3 - indexStart),
                Math.abs(index4 - indexStart),
                Math.abs(index5 - indexStart)
            ].sort((a, b) => a - b)[0] + indexStart;
            
            if(indexEnd < indexStart) indexEnd = question.length;        
            nome = question.substring(indexStart, indexEnd);
            nome = nome.replace(/ é /g, '');
            nome = nome.replace(/é /g, '');
            nome = nome.replace(/é/g, '');
            nome = nome.replace(/:/g, '');
            nome = nome.replace(/[0-9]]/g, '').trim();  

            if(nome.indexOf(' e ') > 0){                    
                nome = nome.split(' e ');
                nome = nome[0].toString().trim();

            }

            if(nome.indexOf(' é ') > 0){                    
                nome = nome.split(' é ');
                nome = nome[0].toString().trim();

            }

            if(nome.indexOf(',') > 0){
                nome = nome.split(', ');
                nome = nome[0].toString().trim();

            }

            if(nome.indexOf(';') > 0){
                nome = nome.split('; ');
                nome = nome[0].toString().trim();

            }

            if(nome.indexOf('.') > 0){
                nome = nome.split('. ');
                nome = nome[0].toString().trim();

            }      
        }
    }
    return nome;
}

const getIdade = function(question = ''){
    question = question.toString().trim();
    question = question.replace(/[^0-9a-zA-Z\s]/g, '');    
    let idade = '';
    if(question.indexOf('anos') > 0){
        let arr = question.split(' ');
        let anos = arr[arr.indexOf('anos')-1];
        if((Number(anos) > 0) && (Number(anos) < 125)) idade = anos;
    }
    return idade;
}

const getEmail = function(_email = ''){
    _email = _email.toString().trim();
    _email = _email.replace(/[^0-9a-zA-Z@.-_]/g, '');
    if((_email.indexOf('@') > 0) && (_email.indexOf('.') > 0) && (_email.length >= 5)) {
        let ultimoCaracter = _email.charAt(_email.length-1);
        if(ultimoCaracter == '.') _email = _email.substring(0, _email.length-1);
        return _email;
    }
    else return '';
}

getCelular = function(_celular = ''){
    _celular = _celular.toString().trim();
    _celular = _celular.replace(/[^0-9]/g, '');
    if(_celular.indexOf('55') == 0) _celular = _celular.substring(2, _celular.length - 2);
    let _cpf = getCPF(_celular);
    if((_celular.length == 11) && (_cpf.length <= 0) && (_celular.indexOf('9') > 0)) return _celular;
    else return '';
}

const getTelefoneFixo = function(_telefone = ''){
    _telefone = _telefone.toString().trim();
    _telefone = _telefone.replace(/[^0-9]/g, '');
    if(_telefone.indexOf('55') == 0) _telefone = _telefone.substring(2, _telefone.length - 2);
    let _cpf = getCPF(_telefone);
    if(_telefone.length == 10) return _telefone;
    else return '';
}


const getCEP = function(_cep = ''){
    _cep = _cep.toString().trim();
    _cep = _cep.replace(/[^0-9]/g, '');
    if(_cep.length == 8) return _cep;
    else return '';
}

const getEndereco = function(question = ''){
    question = question.toString().trim();
    
    let endereco = '';
    
    let start = '';
    if(question.indexOf('Endereço') >= 0 ) start = 'Endereço';
    if(question.indexOf('Endereco') >= 0 ) start = 'Endereco';
    if(question.indexOf('endereço') >= 0 ) start = 'endereço';
    if(question.indexOf('endereco') >= 0 ) start = 'endereco';
    if(question.indexOf('Rua') >= 0 ) start = 'Rua';
    if(question.indexOf('R.') >= 0 ) start = 'R.';
    if(question.indexOf('rua') >= 0 ) start = 'rua';
    if(question.indexOf('r.') >= 0 ) start = 'r.';
    if(question.indexOf('Avenida') >= 0 ) start = 'Avenida';
    if(question.indexOf('Av.') >= 0 ) start = 'Av.';
    if(question.indexOf('avenida') >= 0 ) start = 'avenida';
    if(question.indexOf('av.') >= 0 ) start = 'av.';
    if(question.indexOf('Travessa') >= 0 ) start = 'Travessa';
    if(question.indexOf('Trav.') >= 0 ) start = 'Trav.';
    if(question.indexOf('travessa') >= 0 ) start = 'travessa';
    if(question.indexOf('trav.') >= 0 ) start = 'trav.';
    
    if((start.length > 0) && (question.indexOf('seu') < 0)){
        let indexStart = question.indexOf(start);
                
        let index1 = question.indexOf(' e '); if((index1 < 0) || (index1 < indexStart))  index1 = Infinity;
        let index2 = question.indexOf(','); if((index2 < 0) || (index2 < indexStart))  index2 = Infinity;
        let index3 = question.indexOf(';'); if((index3 < 0) || (index3 < indexStart))  index3 = Infinity;
        let index4 = question.indexOf('.'); if((index4 < 0) || (index4 < indexStart))  index4 = Infinity;
        let index5 = question.indexOf('-'); if((index5 < 0) || (index5 < indexStart))  index5 = Infinity;

        let indexEnd = [
            Math.abs(index1 - indexStart),
            Math.abs(index2 - indexStart),
            Math.abs(index3 - indexStart),
            Math.abs(index4 - indexStart),
            Math.abs(index5 - indexStart)
        ].sort((a, b) => a - b)[0] + indexStart;
        
        if(indexEnd < indexStart) indexEnd = question.length;        
        endereco = question.substring(indexStart, indexEnd);
        endereco = endereco.replace(/ é /g, '').trim();

        let sinalizador = '';
        index1 = endereco.indexOf(' e '); if(index1 >= 0) sinalizador = ' e ';
        index2 = endereco.indexOf(','); if(index2 >= 0) sinalizador = ',';
        index3 = endereco.indexOf(';'); if(index3 >= 0) sinalizador = ';';
        index4 = endereco.indexOf('.'); if(index4 >= 0) sinalizador = '.';
        index5 = endereco.indexOf('-'); if(index5 >= 0) sinalizador = '-';
        
        let lstEnderecos = endereco.split(sinalizador);
        endereco = lstEnderecos[0].toString().trim();
    }

    return endereco;
}

const getBairro = function(question = ''){
    question = question.toString().trim();
    
    let bairro = '';
    
    let start = '';
    if(question.indexOf('Bairro') >= 0 ) start = 'Bairro';
    if(question.indexOf('bairro') >= 0 ) start = 'bairro';
    
    if((start.length > 0) && (question.indexOf('seu') < 0)){
        let indexStart = question.indexOf(start) + start.length + 1;
                
        let index1 = question.indexOf(' e '); if((index1 < 0) || (index1 < indexStart))  index1 = Infinity;
        let index2 = question.indexOf(','); if((index2 < 0) || (index2 < indexStart))  index2 = Infinity;
        let index3 = question.indexOf(';'); if((index3 < 0) || (index3 < indexStart))  index3 = Infinity;
        let index4 = question.indexOf('.'); if((index4 < 0) || (index4 < indexStart))  index4 = Infinity;
        let index5 = question.indexOf('-'); if((index5 < 0) || (index5 < indexStart))  index5 = Infinity;

        let indexEnd = [
            Math.abs(index1 - indexStart),
            Math.abs(index2 - indexStart),
            Math.abs(index3 - indexStart),
            Math.abs(index4 - indexStart),
            Math.abs(index5 - indexStart)
        ].sort((a, b) => a - b)[0] + indexStart;
        
        if(indexEnd < indexStart) indexEnd = question.length;        
        bairro = question.substring(indexStart, indexEnd);
        bairro = bairro.replace(/:/g, '').trim();
        bairro = bairro.replace(/ é /g, '').trim();

        let sinalizador = '';
        index1 = bairro.indexOf(' e '); if(index1 >= 0) sinalizador = ' e ';
        index2 = bairro.indexOf(','); if(index2 >= 0) sinalizador = ',';
        index3 = bairro.indexOf(';'); if(index3 >= 0) sinalizador = ';';
        index4 = bairro.indexOf('.'); if(index4 >= 0) sinalizador = '.';
        index5 = bairro.indexOf('-'); if(index5 >= 0) sinalizador = '-';
        
        let lstBairros = bairro.split(sinalizador);
        bairro = lstBairros[0].toString().trim();
    }

    return bairro;
}

const getNumero = function(_numero, question = ''){
    let numero = '';
    let idade = getIdade(question);
    numero = _numero.toString().trim();
    numero = numero.replace(/[^0-9]/g, '');    
    if((numero.length >= 1) && (numero.length <= 4) && (numero != idade))
        return numero;
    else return ''
}

const getCPF = function(_cpf = ''){ // 46395485083
    _cpf = _cpf.toString().trim().replace(/\D/g, '');
    if(_cpf.toString().length != 11) return '';
    let result = _cpf;
    [9, 10].forEach(function(elemento) {
        let soma = 0, validacao;
        _cpf.split('').splice(0, elemento).forEach(function(atual, proximo){
                    soma += parseInt(atual) * ((elemento+2)-(proximo+1))
        });
        validacao = soma % 11;
        validacao = (validacao < 2) ? 0 : 11 - validacao;
        if(validacao != _cpf.substring(elemento, elemento + 1)) result = '';
    });
    return result;
}

const getCNPJ = function(_cnpj = ''){ // 31835728000167
    _cnpj = _cnpj.toString().trim().replace(/[^\d]+/g, '');
    if(_cnpj == '') return '';
    if(_cnpj.length != 14) return '';

    if(_cnpj == '00000000000000' || 
       _cnpj == '11111111111111' ||
       _cnpj == '22222222222222' ||
       _cnpj == '33333333333333' ||
       _cnpj == '44444444444444' ||
       _cnpj == '55555555555555' ||
       _cnpj == '66666666666666' ||
       _cnpj == '77777777777777' ||
       _cnpj == '88888888888888' ||
       _cnpj == '99999999999999') 
       return '';
        
        let tamanho = _cnpj.length - 2;
        let numeros = _cnpj.substring(0, tamanho);
        let digitos = _cnpj.substring(tamanho);
        let soma = 0;
        let posicao = tamanho - 7;
        for(let i = tamanho; i >= 1; i--){
            soma += numeros.charAt(tamanho-i) * posicao--;
            if(posicao < 2) posicao = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if(resultado != digitos.charAt(0)) return '';
        tamanho = tamanho + 1;
        numeros = _cnpj.substring(0, tamanho);
        soma = 0;
        posicao = tamanho -7;
        for(let i = tamanho; i >= 1; i--){
            soma += numeros.charAt(tamanho-i) * posicao--;
            if(posicao < 2) posicao = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if(resultado != digitos.charAt(1)) return '';

        return _cnpj;

}

