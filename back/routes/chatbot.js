// raiz de peticiones que llegan aqui: api/ejercicios (Ruta base)
// Aqui se realizan validaciones / controles seguridad

const { Router }= require('express');
const { obtenerQuery } = require('../controllers/chatbot');
const { validarJWT } = require('../middleware/validar-jwt');
const {WebhookClient} = require('dialogflow-fulfillment');

const router = Router();

// Declaracion de rutas (sentencias crud)

router.post('/' ,function(req, res) {
  const agent = new WebhookClient({ request: req, response: res });
  console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  function Webhook(agent) {
    agent.add(`FUNCIONA!!!`);

  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Webhook', Webhook);
  agent.handleRequest(intentMap);
});


router.get('/',//validarJWT, 
obtenerQuery);

module.exports = router;