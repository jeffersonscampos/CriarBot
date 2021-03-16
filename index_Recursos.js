const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bodyParser = require('body-parser');

let db = null;
const url = 'mongodb://localhost:27017';
const dbName = 'chatbotdb';

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(jsonParser);
app.use(urlencodedParser);
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/test/data'));
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
	assert.equal(null, err);
	console.log('banco de dados conectado com sucesso.');

	db = client.db(dbName);
});

app.listen(3000);
console.log('servidor rodando em: localhost:3000');
//INTERFACE #########################################################################
app.get('/login', urlencodedParser, function(req, res) {
	res.set('Content-Type', 'text/html');
	const fs = require('fs');
	const data = fs.readFileSync('./login.html', 'utf8');
	res.send(data);
});
app.get('/index', urlencodedParser, function(req, res) {
	let objJSON = {};
	if(req.query.user_name) objJSON.user_name = req.query.user_name; 
	else objJSON.user_name = false;
	if(req.query.password) objJSON.password = req.query.password; 
	else objJSON.password = false;

	findUserOne(objJSON, function(result) {
		if((result)&&(result.activate==true)) {
			res.set('Content-Type', 'text/html');
			const fs = require('fs');
			const data = fs.readFileSync('./index.html', 'utf8');
			res.send(data);	
		}else {
			res.set('Content-Type', 'text/html');
			const fs = require('fs');
			const data = fs.readFileSync('./login.html', 'utf8');
			res.send(data);
		}
	});
});
app.post('/user/search', urlencodedParser, function(req, res) {
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
app.post('/documents/find', urlencodedParser, function(req, res) {
	let objJSON = {};
	if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); 
	else objJSON.code_user = -1;
	if(req.body.activate) objJSON.activate = Boolean(req.body.activate); 
	else objJSON.activate = true;

	findDocuments(objJSON, function(result) {
		res.send(result);
	});
});
const findDocuments = function(objJSON, callback) {
	const collection = db.collection('documents');
	collection.find(objJSON).toArray(function(err, result) {
		assert.equal(null, err);
		callback(result);
	});
}
//###################################################################################

app.post('/user/insert', urlencodedParser, function(req, res) {
	let objJSON = {};
	if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); else objJSON.code_user = cod();
	if(req.body.activate) objJSON.activate = Boolean(req.body.activate); else objJSON.activate = true;
	if(req.body.full_name) objJSON.full_name = req.body.full_name; else objJSON.full_name = '';
	if(req.body.user_name) objJSON.user_name = req.body.user_name; else objJSON.user_name = '';
	if(req.body.email) objJSON.email = req.body.email; else objJSON.email = '';
	if(req.body.password) objJSON.password = req.body.password; else objJSON.password = '';

	insertUser(objJSON, function(result) {
		res.send(result);
	});
});

app.post('/user/update', urlencodedParser, function(req, res) {
	let objJSON = {};
	if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
	if(req.body.activate) objJSON.activate = Boolean(req.body.activate);
	if(req.body.full_name) objJSON.full_name = req.body.full_name;
	if(req.body.user_name) objJSON.user_name = req.body.user_name;
	if(req.body.email) objJSON.email = req.body.email;
	if(req.body.password) objJSON.password = req.body.password;

	updateUser(objJSON, function(result) {
		res.send(result);
	});
});

app.post('/user/delete', urlencodedParser, function(req, res) {
	let objJSON = {};
	if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
	if(req.body.activate) objJSON.activate = Boolean(req.body.activate);
	if(req.body.full_name) objJSON.full_name = req.body.full_name;
	if(req.body.user_name) objJSON.user_name = req.body.user_name;
	if(req.body.email) objJSON.email = req.body.email;
	if(req.body.password) objJSON.password = req.body.password;

	deleteUser(objJSON, function(result) {
		res.send(result);
	});
});

app.post('/user/find', urlencodedParser, function(req, res) {
	let objJSON = {};
	if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
	if(req.body.activate) objJSON.activate = Boolean(req.body.activate);
	if(req.body.full_name) objJSON.full_name = req.body.full_name;
	if(req.body.user_name) objJSON.user_name = req.body.user_name;
	if(req.body.email) objJSON.email = req.body.email;
	if(req.body.password) objJSON.password = req.body.password;

	findUser(objJSON, function(result) {
		res.send(result);
	});
});

app.post('/user/activate/true', urlencodedParser, function(req, res) {
	let objJSON = {};
	if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); else objJSON.code_user = 0;

	activateUserTrue(objJSON, function(result) {
		res.send(result);
	});
});

app.post('/user/activate/false', urlencodedParser, function(req, res) {
	let objJSON = {};
	if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); else objJSON.code_user = 0;

	activateUserFalse(objJSON, function(result) {
		res.send(result);
	});
});

app.post('/user/delete/all', urlencodedParser, function(req, res) {
	let objJSON = {};
	if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); else objJSON.code_user = 0;

	deleteUserAll(objJSON, function(result) {
		res.send(result);
	});
});

app.post('/chatbot/insert', urlencodedParser, function(req, res) {
	let objJSON = {};
	if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); else objJSON.code_user = 0;
	if(req.body.activate) objJSON.activate = Boolean(req.body.activate); else objJSON.activate = true;
	if(req.body.code_current) objJSON.code_current = Number(req.body.code_current); else objJSON.code_current = cod();
	if(req.body.code_relation) objJSON.code_relation = Number(req.body.code_relation); else objJSON.code_relation = 0;
	if(req.body.code_before) objJSON.code_before = Number(req.body.code_before); else objJSON.code_before = 0;
	if(req.body.input) objJSON.input = req.body.input; else objJSON.input = '';
	if(req.body.output) objJSON.output = req.body.output; else objJSON.output = 'Desculpe, mas não entendi.';

	insertData(objJSON, function(result) {
		res.send(result);
	});
});

function cod() {
	const data = new Date();
	const ano = data.getFullYear();
	const mes = data.getMonth();
	const dia = data.getDate();
	const hora = data.getHours();
	const minuto = data.getMinutes();
	const segundo = data.getSeconds();
	const milesegundos = data.getMilliseconds();
	const result = Number(parseFloat(Number(ano+''+mes+''+dia+''+hora+''+minuto+''+segundo+''+milesegundos)/2).toFixed(0));
	return result;
}

app.post('/chatbot/update', urlencodedParser, function(req, res) {
	let objJSON = {};
	if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
	if(req.body.activate) objJSON.activate = Boolean(req.body.activate);
	if(req.body.code_current) objJSON.code_current = Number(req.body.code_current);
	if(req.body.code_relation) objJSON.code_relation = Number(req.body.code_relation);
	if(req.body.code_before) objJSON.code_before = Number(req.body.code_before);
	if(req.body.input) objJSON.input = req.body.input;
	if(req.body.output) objJSON.output = req.body.output;

	updateData(objJSON, function(result) {
		res.send(result);
	});
});

app.post('/chatbot/delete', urlencodedParser, function(req, res) {
	let objJSON = {};
	if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
	if(req.body.activate) objJSON.activate = Boolean(req.body.activate);
	if(req.body.code_current) objJSON.code_current = Number(req.body.code_current);
	if(req.body.code_relation) objJSON.code_relation = Number(req.body.code_relation);
	if(req.body.code_before) objJSON.code_before = Number(req.body.code_before);
	if(req.body.input) objJSON.input = req.body.input;
	if(req.body.output) objJSON.output = req.body.output;

	deleteData(objJSON, function(result) {
		res.send(result);
	});
});

app.post('/chatbot/find', urlencodedParser, function(req, res) {
	let objJSON = {};
	if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
	if(req.body.activate) objJSON.activate = Boolean(req.body.activate);
	if(req.body.code_current) objJSON.code_current = Number(req.body.code_current);
	if(req.body.code_relation) objJSON.code_relation = Number(req.body.code_relation);
	if(req.body.code_before) objJSON.code_before = Number(req.body.code_before);
	if(req.body.input) objJSON.input = req.body.input;
	if(req.body.output) objJSON.output = req.body.output;

	findData(objJSON, function(result) {
		res.send(result);
	});
});

const insertUser = function(objJSON, callback) {
	const collection = db.collection('user');
	collection.insertOne(objJSON, function(err, result) {
		assert.equal(null, err);
		callback(result);
	});
}

const updateUser = function(objJSON, callback) {
	const collection = db.collection('user');
	const code_user = objJSON.code_user;
	collection.updateOne({code_user: code_user}, {$set: objJSON}, function(err, result) {
		assert.equal(null, err);
		callback(result);
	});
}

const deleteUser = function(objJSON, callback) {
	const collection = db.collection('user');
	collection.deleteOne(objJSON, function(err, result) {
		assert.equal(null, err);
		callback(result);
	});
}

const findUser = function(objJSON, callback) {
	const collection = db.collection('user');
	collection.find(objJSON).toArray(function(err, result) {
		assert.equal(null, err);
		callback(result);
	});
}

const activateUserTrue = function(objJSON, callback) {
	const collection = db.collection('user');
	const code_user = Number(objJSON.code_user);
	collection.updateOne({code_user: code_user}, {$set: {activate: true}});
	const collection = db.collection('documents');
	collection.updateMany({code_user: code_user}, {$set: {activate: true}});
	const collection = db.collection('chatbot');
	collection.updateMany({code_user: code_user}, {$set: {activate: true}}, function(err, result) {
		assert.equal(null, err);
		callback(result);
	});
}

const activateUserFalse = function(objJSON, callback) {
	const collection = db.collection('user');
	const code_user = Number(objJSON.code_user);
	collection.updateOne({code_user: code_user}, {$set: {activate: false}});
	const collection = db.collection('documents');
	collection.updateMany({code_user: code_user}, {$set: {activate: false}});
	const collection = db.collection('chatbot');
	collection.updateMany({code_user: code_user}, {$set: {activate: false}}, function(err, result) {
		assert.equal(null, err);
		callback(result);
	});
}

const deleteUserAll = function(objJSON, callback) {
	const collection = db.collection('chatbot');
	collection.deleteMany(objJSON, function(err, result) {
		assert.equal(null, err);
		callback(result);
	});
}

const insertData = function(objJSON, callback) {
	const collection = db.collection('chatbot');
	collection.insertOne(objJSON, function(err, result) {
		assert.equal(null, err);
		callback(result);
	});
}

const updateData = function(objJSON, callback) {
	const collection = db.collection('chatbot');
	const code_current = objJSON.code_current;
	collection.updateOne({code_current: code_current}, {$set: objJSON}, function(err, result) {
		assert.equal(null, err);
		callback(result);
	});
}

const deleteData = function(objJSON, callback) {
	const collection = db.collection('chatbot');
	collection.deleteOne(objJSON, function(err, result) {
		assert.equal(null, err);
		callback(result);
	});
}

const findData = function(objJSON, callback) {
	const collection = db.collection('chatbot');
	collection.find(objJSON).toArray(function(err, result) {
		assert.equal(null, err);
		callback(result);
	});
}

app.get('/chatbot/question', urlencodedParser, function(req, res) {
	let objJSON = {};
	if(req.query.code_user) objJSON.code_user = Number(req.query.code_user); else objJSON.code_user = 0;
	if(req.body.activate) objJSON.activate = Boolean(req.body.activate); else objJSON.activate = true;
	if(req.query.code_before) objJSON.code_before = Number(req.query.code_before); else objJSON.code_before = 0;
	if(req.query.input) objJSON.input = req.query.input; else objJSON.input = '';

	questionData(objJSON, function(result) {
		res.send(result);
	});
});

const questionData = function(objJSON, callback) {
	const collection = db.collection('chatbot');
	collection.find(objJSON).toArray(function(err, result) {
		assert.equal(null, err);
		if(result.length<=0) {
			let code_before = Number(objJSON.code_before);
			let objFind = {};
			if(code_before>0) {
				objFind = {
					code_user: Number(objJSON.code_user),
					code_relation: code_before
				};
			}else {
				objFind = {
					code_user: Number(objJSON.code_user)
				};
			}
			collection.find(objFind).toArray(function(err, result) {
				assert.equal(null, err);
				if(result.length<=0) {
					collection.find({code_user: Number(objJSON.code_user)}).toArray(function(err, result) {
						result = nlp(objJSON.input, result, Number(objJSON.code_user));
						callback(result);
					});
				}else {
					result = nlp(objJSON.input, result, Number(objJSON.code_user));
					callback(result);					
				}
			});
		}else callback(result);
	});
}

const nlp = function(question='', array=[], code_user=-1) {
	let originalQuestion = question.toString().trim();
	let findInput = 0;
	let findIndex = 0;

	let documents = getDocuments(originalQuestion, code_user);
	if(documents) {
		return [{
					"_id": "0",
					"code_user": code_user,
					"activate": true,
					"code_current": -1,
					"code_relation": -1,
					"code_before": -1,
					"input": originalQuestion,
					"output": "Ok! Entendido."		
				}];
	}else {
		for(let i=0; i<array.length; i++) {
			question = question.toString().trim();
			let input = array[i].input.toString().trim();
			if(input.length<=0) input = array[i].output.toString().trim();
			question = question.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
			input = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
			question = question.replace(/[^a-zA-Z0-9\s]/g, '');
			input = input.replace(/[^a-zA-Z0-9\s]/g, '');

			let tokenizationQuestion = question.split(' ');
			let tokenizationInput = input.split(' ');

			tokenizationQuestion = tokenizationQuestion.map(function(e) {
				if(e.length>3) return e.substr(0, e.length-3); else return e;
			});
			tokenizationInput = tokenizationInput.map(function(e) {
				if(e.length>3) return e.substr(0, e.length-3); else return e;
			});

			let words = 0;
			for(let x=0; x<tokenizationQuestion.length; x++) {
				if(tokenizationInput.indexOf(tokenizationQuestion[x])>=0) words++;
			}
			if(words>findInput) {
				findInput = words;
				findIndex = i;
			}
		}

		if(findInput>0) return [{
			"_id": array[findIndex]._id,
			"code_user": array[findIndex].code_user,
			"activate": array[findIndex].activate,
			"code_current": array[findIndex].code_current,
			"code_relation": array[findIndex].code_relation,
			"code_before": array[findIndex].code_before,
			"input": originalQuestion,
			"output": array[findIndex].output
		}];
		else return [{
			"_id": "0",
			"code_user": array[findIndex].code_user,
			"activate": array[findIndex].activate,
			"code_current": array[findIndex].code_current,
			"code_relation": array[findIndex].code_relation,
			"code_before": array[findIndex].code_before,
			"input": originalQuestion,
			"output": "Desculpe, mas não sei te responder."		
		}];
	}
}

const getDocuments = function(question='', code_user=-1) {
	question = question.toString().trim();

	let _nome = getName(question);
	let _idade = getYears(question);
	let _email = '';
	let _celular = '';
	let _telefone = '';
	let _cep = '';
	let _endereco = getEndereco(question);
	let _bairro = getBairro(question);
	let _numero = '';
	let _cpf = '';
	let _cnpj = '';

	const questionTokens = question.split(' ');
	for(let i=0; i<questionTokens.length; i++) {
		let word = questionTokens[i].toString().trim();

		if(word.length>=1) {
			if(_email.length<=0) _email = email(word);
			if(_celular.length<=0) _celular = celular(word);
			if(_telefone.length<=0) _telefone = telefone(word);
			if(_cep.length<=0) _cep = cep(word);
			if(_numero.length<=0) _numero = numero(word, question);
			if(_cpf.length<=0) _cpf = cpf(word);
			if(_cnpj.length<=0) _cnpj = cnpj(word);
		}
	}

	let objJSON = {};
	if(code_user>0) objJSON.code_user = code_user; else objJSON.code_user = -1;
	if(_nome.length>0) objJSON.nome = _nome; else objJSON.nome = '';
	if(_idade.length>0) objJSON.idade = Number(_idade); else objJSON.idade = '';
	if(_email.length>0) objJSON.email = _email; else objJSON.email = '';
	if(_celular.length>0) objJSON.celular = Number(_celular); else objJSON.celular = '';
	if(_telefone.length>0) objJSON.telefone = Number(_telefone); else objJSON.telefone = '';
	if(_cep.length>0) objJSON.cep = Number(_cep); else objJSON.cep = '';
	if(_endereco.length>0) objJSON.endereco = _endereco; else objJSON.endereco = '';
	if(_bairro.length>0) objJSON.bairro = _bairro; else objJSON.bairro = '';
	if(_numero.length>0) objJSON.numero = Number(_numero); else objJSON.numero = '';
	if(_cpf.length>0) objJSON.cpf = Number(_cpf); else objJSON.cpf = '';
	if(_cnpj.length>0) objJSON.cnpj = Number(_cnpj); else objJSON.cnpj = '';
	objJSON.activate = true;

	if((_nome.length>0)||
	   (_idade.length>0)||
	   (_email.length>0)||
	   (_celular.length>0)||
	   (_telefone.length>0)||
	   (_cep.length>0)||
	   (_endereco.length>0)||
	   (_bairro.length>0)||
	   (_numero.length>0)||
	   (_cpf.length>0)||
	   (_cnpj.length>0)) {
		const collection = db.collection('documents');
		collection.insertOne(objJSON);
		return true;
	}else return false;
}

const defaultName = function(question='') {
	let nome = '';
	const fs = require('fs');
	const data = fs.readFileSync('./names.csv', 'utf8');
	const names = data.toString().trim().split(',');
	let tempName = '';
	let tempIndex = Infinity;
	for(let i=0; i<names.length; i++) {
		let name = names[i].toString().trim();
		let indexStart = question.indexOf(name);
		if(indexStart>=0) {
			if((name!=tempName)&&(indexStart<tempIndex)) {
				tempName = name;
				tempIndex = indexStart;

				let index1 = question.indexOf(' e '); if((index1<0)||(index1<indexStart)) index1 = Infinity;
				let index2 = question.indexOf(' é '); if((index2<0)||(index2<indexStart)) index2 = Infinity;
				let index3 = question.indexOf(','); if((index3<0)||(index3<indexStart)) index3 = Infinity;
				let index4 = question.indexOf(';'); if((index4<0)||(index4<indexStart)) index4 = Infinity;
				let index5 = question.indexOf('.'); if((index5<0)||(index5<indexStart)) index5 = Infinity;
				let indexEnd = [
					Math.abs(index1-indexStart),
					Math.abs(index2-indexStart),
					Math.abs(index3-indexStart),
					Math.abs(index4-indexStart),
					Math.abs(index5-indexStart)
				].sort((a, b) => a - b)[0]+indexStart;
				if(indexEnd<indexStart) indexEnd = question.length;
				if(indexEnd<0) indexEnd = question.length;
				nome = question.substring(indexStart, indexEnd);
				nome = nome.replace(/ é /g, '');
				nome = nome.replace(/:/g, '');
				nome = nome.replace(/[0-9]/g, '').trim();			
			}
		}
	}
	return nome.trim();
}

const getName = function(question='') {
	question = question.toString().trim();
	let nome = '';
	let Default = defaultName(question);
	if(Default.length<=0) {
		let start = '';
		if(question.indexOf('Nome')>=0) start = 'Nome';
		if(question.indexOf('nome')>=0) start = 'nome';
		if(question.indexOf('chamo')>=0) start = 'chamo';

		if((start.length>0)&&(question.indexOf('seu')<0)) {
			let indexStart = question.indexOf(start)+start.length+1;

			let index1 = question.indexOf(' e '); if((index1<0)||(index1<indexStart)) index1 = Infinity;
			let index2 = question.indexOf(','); if((index2<0)||(index2<indexStart)) index2 = Infinity;
			let index3 = question.indexOf(';'); if((index3<0)||(index3<indexStart)) index3 = Infinity;
			let index4 = question.indexOf('.'); if((index4<0)||(index4<indexStart)) index4 = Infinity;
			let indexEnd = [
				Math.abs(index1-indexStart),
				Math.abs(index2-indexStart),
				Math.abs(index3-indexStart),
				Math.abs(index4-indexStart)
			].sort((a, b) => a - b)[0]+indexStart;
			if(indexEnd<indexStart) indexEnd = question.length;
			nome = question.substring(indexStart, indexEnd);
			nome = nome.replace(/ é /g, '');
			nome = nome.replace(/:/g, '');
			nome = nome.replace(/[0-9]/g, '').trim();
		}
	}else nome = Default;
	return nome;
}

const getYears = function(question='') {
	question = question.toString().trim();
	question = question.replace(/[^0-9a-zA-Z\s]/g, '');
	let idade = '';
	if(question.indexOf('anos')>0) {
		let arr = question.split(' ');
		let anos = arr[arr.indexOf('anos')-1];
		if((Number(anos)>0)&&(Number(anos)<125)) idade = anos;
	}
	return idade;
}

const email = function(_email='') {
	_email = _email.toString().trim();
	_email = _email.replace(/[^0-9a-zA-Z@.-_]/g, '');
	if((_email.indexOf('@')>0)&&(_email.indexOf('.')>0)&&(_email.length>=5)) {
		let c = _email.charAt(_email.length-1);
		if(c=='.') _email = _email.substring(0, _email.length-1);
		return _email;
	}
	else return '';
}

const celular = function(_celular='') {
	_celular = _celular.toString().trim();
	_celular = _celular.replace(/[^0-9]/g, '');
	if(_celular.indexOf('55')==0) _celular = _celular.replace('55', '');
	let _cpf = cpf(_celular);
	if((_celular.length==11)&&(_cpf.length<=0)&&(_celular.indexOf('9')>0)) return _celular;
	else return '';
}

const telefone = function(_telefone='') {
	_telefone = _telefone.toString().trim();
	_telefone = _telefone.replace(/[^0-9]/g, '');
	if(_telefone.indexOf('55')==0) _telefone = _telefone.replace('55', '');
	if(_telefone.length==10) return _telefone;
	else return '';
}

const cep = function(_cep='') {
	_cep = _cep.toString().trim();
	_cep = _cep.replace(/[^0-9]/g, '');
	if(_cep.length!=8) return '';
	else return _cep;
}

const getEndereco = function(question='') {
	question = question.toString().trim();
	let endereco = '';
	let start = '';
	if(question.indexOf('Endereço')>=0) start = 'Endereço';
	if(question.indexOf('Rua')>=0) start = 'Rua';
	if(question.indexOf('R.')>=0) start = 'R.';
	if(question.indexOf('Avenida')>=0) start = 'Avenida';
	if(question.indexOf('Av.')>=0) start = 'Av.';
	if(question.indexOf('Travessa')>=0) start = 'Travessa';

	if(start.length>0) {
		let indexStart = question.indexOf(start);

		let index1 = question.indexOf(' e '); if((index1<0)||(index1<indexStart)) index1 = Infinity;
		let index2 = question.indexOf(','); if((index2<0)||(index2<indexStart)) index2 = Infinity;
		let index3 = question.indexOf(';'); if((index3<0)||(index3<indexStart)) index3 = Infinity;
		let index4 = question.indexOf('.'); if((index4<0)||(index4<indexStart)) index4 = Infinity;
		let index5 = question.indexOf('-'); if((index5<0)||(index5<indexStart)) index5 = Infinity;
		let indexEnd = [
			Math.abs(index1-indexStart),
			Math.abs(index2-indexStart),
			Math.abs(index3-indexStart),
			Math.abs(index4-indexStart),
			Math.abs(index5-indexStart)
		].sort((a, b) => a - b)[0]+indexStart;
		if(indexEnd<indexStart) indexEnd = question.length;
		endereco = question.substring(indexStart, indexEnd);
		endereco = endereco.replace(/ é /g, '').trim();

		let carac = '';
		index1 = endereco.indexOf(' e '); if(index1>=0) carac = ' e ';
		index2 = endereco.indexOf(','); if(index2>=0) carac = ',';
		index3 = endereco.indexOf(';'); if(index3>=0) carac = ';';
		index4 = endereco.indexOf('.'); if(index4>=0) carac = '.';
		index5 = endereco.indexOf('-'); if(index5>=0) carac = '-';
		let arrEndereco = endereco.split(carac);
		endereco = arrEndereco[0].toString().trim();
	}
	return endereco;
}

const getBairro = function(question='') {
	question = question.toString().trim();
	let bairro = '';
	let start = '';
	if(question.indexOf('Bairro')>=0) start = 'Bairro';

	if(start.length>0) {
		let indexStart = question.indexOf(start)+start.length+1;

		let index1 = question.indexOf(' e '); if((index1<0)||(index1<indexStart)) index1 = Infinity;
		let index2 = question.indexOf(','); if((index2<0)||(index2<indexStart)) index2 = Infinity;
		let index3 = question.indexOf(';'); if((index3<0)||(index3<indexStart)) index3 = Infinity;
		let index4 = question.indexOf('.'); if((index4<0)||(index4<indexStart)) index4 = Infinity;
		let index5 = question.indexOf('-'); if((index5<0)||(index5<indexStart)) index5 = Infinity;
		let indexEnd = [
			Math.abs(index1-indexStart),
			Math.abs(index2-indexStart),
			Math.abs(index3-indexStart),
			Math.abs(index4-indexStart),
			Math.abs(index5-indexStart)
		].sort((a, b) => a - b)[0]+indexStart;
		if(indexEnd<indexStart) indexEnd = question.length;
		bairro = question.substring(indexStart, indexEnd);
		bairro = bairro.replace(/:/g, '')
		bairro = bairro.replace(/ é /g, '').trim();

		let carac = '';
		index1 = bairro.indexOf(' e '); if(index1>=0) carac = ' e ';
		index2 = bairro.indexOf(','); if(index2>=0) carac = ',';
		index3 = bairro.indexOf(';'); if(index3>=0) carac = ';';
		index4 = bairro.indexOf('.'); if(index4>=0) carac = '.';
		index5 = bairro.indexOf('-'); if(index5>=0) carac = '-';
		let arrBairro = bairro.split(carac);
		bairro = arrBairro[0].toString().trim();
	}
	return bairro;
}

const numero = function(_numero='', question='') {
	let Numero = '';
	let idade = getYears(question);
	Numero = _numero.toString().trim();
	Numero = Numero.replace(/[^0-9]/g, '');
	if((Numero.length>=1)&&(Numero.length<=4)&&(Numero!=idade)) return Numero;
	else return '';
}

const cpf = function(_cpf='') { // 46395485083
	_cpf = _cpf.toString().trim().replace(/\D/g, '');
	if(_cpf.toString().length != 11) return '';
	let result = _cpf;
	[9, 10].forEach(function(j) {
		let soma = 0, r;
		_cpf.split('').splice(0, j).forEach(function(e, i) {
			soma += parseInt(e) * ((j+2)-(i+1));
		});
		r = soma % 11;
		r = (r < 2) ? 0 : 11 - r;
		if(r != _cpf.substring(j, j+1)) result = '';
	});
	return result;
}

const cnpj = function(_cnpj='') { // 31835728000167
	_cnpj = _cnpj.toString().trim().replace(/[^\d]+/g, '');
	if(_cnpj=='') return '';
	if(_cnpj.length!=14) return '';

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

	let tamanho = _cnpj.length-2;
	let numeros = _cnpj.substring(0, tamanho);
	let digitos = _cnpj.substring(tamanho);
	let soma = 0;
	let pos = tamanho-7;
	for(let i=tamanho; i>=1; i--) {
		soma += numeros.charAt(tamanho-i) * pos--;
		if(pos<2) pos=9;
	}
	let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
	if(resultado != digitos.charAt(0)) return '';
	tamanho = tamanho+1;
	numeros = _cnpj.substring(0, tamanho);
	soma = 0;
	pos = tamanho-7;
	for(let i=tamanho; i>=1; i--) {
		soma += numeros.charAt(tamanho-i) * pos--;
		if(pos<2) pos=9;
	}
	resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
	if(resultado != digitos.charAt(1)) return '';

	return _cnpj;
}
