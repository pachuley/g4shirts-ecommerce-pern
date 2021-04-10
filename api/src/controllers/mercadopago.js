const mercadopago = require ('mercadopago');

mercadopago.configure({
    access_token: 'TEST-5871045351007605-040420-32f43afa4d0086400a770a5060cf0ecc-442727257'
});

const MercadoPagoController = async (req, res) => {

  const { preference } = req.body;

  try{
    const response = await mercadopago.preferences.create(preference);
    console.log(response);
    res.json(response);
  }catch(err){
    res.send(err);
    console.log(err)
  }
}

module.exports = {
  MercadoPagoController
}