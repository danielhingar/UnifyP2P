const { chromium } = require('playwright');
const schedule = require('node-schedule');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config('./.env');

const email = process.env.EMAIL;
const pass = process.env.PASS;
const mongourl = process.env.MONGOURL;

schedule.scheduleJob('00 14 19 * * *', function(){
    console.log('EJECUTA SCHEDULED');
    getBeneficios();
    console.log('Finalizado');
  });



async function getBeneficios() {
    var now = new Date();
    var isoString = now.toISOString();
    var fecha = new Date(isoString);
    const browser = await chromium.launch({ headless: true});

    const pagePeerBerry = await browser.newPage();
    await pagePeerBerry.goto('https://peerberry.com/es/client/overview');
    await pagePeerBerry.fill('form > div:nth-child(1) > div > div > input', email);
    await pagePeerBerry.fill('form > div:nth-child(2) > div > div > input', pass);
    await pagePeerBerry.getByRole('button', { name: 'Iniciar sesión' }).click();
    let totalPeerBerry = await pagePeerBerry.innerText("div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-sm-12.MuiGrid-grid-md-8 > div > div:nth-child(1) > div > div > div:nth-child(1) > div > div:nth-child(1) > div");
    let dineroInvertidoPeerBerry = await pagePeerBerry.innerText("div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-sm-12.MuiGrid-grid-md-8 > div > div:nth-child(1) > div > div > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > span");
    let disponibleInvertirPeerBerry = await pagePeerBerry.innerText("div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-sm-12.MuiGrid-grid-md-8 > div > div:nth-child(1) > div > div > div> div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > span");
    let benefecioPeerBerry = await pagePeerBerry.innerText("div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-3 > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-sm-12.MuiGrid-grid-md-8 > div > div:nth-child(1) > div > div > div > div:nth-child(3) > div:nth-child(3) > div:nth-child(2) > span");
    let peerBerry = new Plataforma(totalPeerBerry, benefecioPeerBerry, fecha, '0.0', dineroInvertidoPeerBerry, disponibleInvertirPeerBerry);
    insertarRegistros("Peerberry", peerBerry)

    const pageRobocash = await browser.newPage();
    await pageRobocash.goto('https://robo.cash/es/cabinet/summary');
    await pageRobocash.fill('#auth_email', email);
    await pageRobocash.fill('#auth_password', pass);
    await pageRobocash.getByRole('button', { name: 'ENTRAR' }).click();
    let beneficioRobocash = await pageRobocash.innerText("div.col-sm-12.col-md-6.col-lg-4.earned_interests > div > div.white-block-body > div.left.value > span > span");
    let totalRobocash = await pageRobocash.innerText("div > div.col-lg-12 > div > div:nth-child(1) > div > div.white-block-body > div.left.value.digit > span > span");
    let bonusRobocash = await pageRobocash.innerText("div > div.col-lg-12 > div > div.col-sm-12.col-md-6.col-lg-4.earned_bonuses > div > div.white-block-body > div.left.value > span > span");
    let dineroInvertidoRobocash = await pageRobocash.innerHTML("div.white-block-body > div > div.col-xs-6.left-line.right > div.digit > strong");
    let disponibleInvertirRobocash = await pageRobocash.innerHTML("div.white-block-body > div > div:nth-child(1) > div.digit.gradient-digit > strong > span > span");
    let robocash = new Plataforma(totalRobocash, beneficioRobocash, fecha, bonusRobocash, dineroInvertidoRobocash, disponibleInvertirRobocash);
    insertarRegistros("Robocash", robocash);

    const pageEsketit = await browser.newPage();
    await pageEsketit.goto('https://esketit.com/investor');
    await pageEsketit.fill('#email', email);
    await pageEsketit.fill('#password', pass);
    await pageEsketit.getByRole('button', { name: 'Login' }).click();
    let beneficioEsketit = await pageEsketit.innerText("section.section-details.py-5 > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > div.text-right");
    let totalEsketit = await pageEsketit.innerText("section.section-details.py-5 > div > div > div:nth-child(1) > div > div:nth-child(1) > div.panel-row.mb-3.mt-3 > div.text-right");
    let bonusEsketit = await pageEsketit.innerText("section.section-details.py-5 > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(4) > div.text-right");
    let dineroInvertidoEsketit = await pageEsketit.innerText("section.section-details.py-5 > div > div > div:nth-child(1) > div > div:nth-child(1) > div.panel-row.mb-3.mt-3 > div.text-right");
    let disponibleInvertirEsketit = await pageEsketit.innerText("section.section-details.py-5 > div > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(3) > div.text-right");
    let esketit = new Plataforma(totalEsketit, beneficioEsketit, fecha, bonusEsketit, dineroInvertidoEsketit, disponibleInvertirEsketit);
    insertarRegistros("Esketit", esketit);


    const pageBrickstarter = await browser.newPage();
    await pageBrickstarter.goto('https://brickstarter.com/panel/mis-inversiones');
    await pageBrickstarter.fill('form > input:nth-child(2)', email);
    await pageBrickstarter.fill('form > input:nth-child(3)', pass);
    let button = await pageBrickstarter.locator('input.button.button--full.button--mvl-full.\\|.mt-16');
    await button.click();
    let beneficioBrickstarter = await pageBrickstarter.innerText("#inmuebles- > div > a > div.property__info.\\|.clearfix.pt-24.ph-24.pb-32 > div:nth-child(9) > h4");
    let totalBrickstarter = await pageBrickstarter.innerText("#inmuebles- > div > a > div.property__info.\\|.clearfix.pt-24.ph-24.pb-32 > div:nth-child(8) > h4");
    let bonusBrickstarter = '15 €';
    let brickstarter = new Plataforma(totalBrickstarter, beneficioBrickstarter, fecha, bonusBrickstarter, '0.0', '0.0');
    insertarRegistros("Brickstarter", brickstarter)


    const pageLendermarket = await browser.newPage();
    await pageLendermarket.goto('https://app.lendermarket.com/es/resumen');
    await pageLendermarket.getByRole('textbox', { name: 'Correo electrónico' }).fill(email);
    await pageLendermarket.getByRole('textbox', { name: 'Contraseña' }).fill(pass);
    await pageLendermarket.getByRole('button', { name: 'Iniciar Sesión' }).click();
    let beneficioLendermarket = await pageLendermarket.innerText("div:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > span");
    let totalLendermarket = await pageLendermarket.innerText("div:nth-child(1) > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > span");
    let bonusLendermarket = await pageLendermarket.innerText("div:nth-child(2) > div > table > tbody > tr:nth-child(5) > td:nth-child(2) > span");
    let dineroInvertidoLendermarket = await pageLendermarket.innerHTML("div:nth-child(1) > div > table > tbody > tr:nth-child(2) > td:nth-child(2) > span");
    let disponibleInvertirLendermarket = await pageLendermarket.innerHTML("div:nth-child(1) > div > table > tbody > tr:nth-child(3) > td:nth-child(2) > span");
    let lendermarket = new Plataforma(totalLendermarket, beneficioLendermarket, fecha, bonusLendermarket, dineroInvertidoLendermarket, disponibleInvertirLendermarket);
    insertarRegistros("Lendermarket", lendermarket)


    browser.close();
    
};

class Plataforma {
    constructor(total, beneficioBruto, date, bonus, dineroInvertido, disponibleInvertir) {
        this.total = convertirPrecioANumero(total);
        this.beneficioBruto = convertirPrecioANumero(beneficioBruto);
        this.beneficioNeto = convertirPrecioANumero((this.beneficioBruto - (this.beneficioBruto * 0.19)).toFixed(2));
        this.bonus = convertirPrecioANumero(bonus);
        this.dineroInvertido = convertirPrecioANumero(dineroInvertido);
        this.disponibleInvertir = convertirPrecioANumero(disponibleInvertir);
        this.date = date;
    }

}

function convertirPrecioANumero(param) {
    let precio;
    param = param.replace(',', '.');
    var numb = param.match(/[\d\.]+/);
    numb = numb.join("");
    precio = parseFloat(numb);
    return precio;
}

function insertarRegistros(collectionName, object) {
    const url = mongourl;

    // Utiliza el método connect() para conectarte a MongoDB Atlas
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) throw err;

        // Selecciona la base de datos y la colección
        const db = client.db("P2P");
        const collection = db.collection(collectionName);

        // Utiliza el método insertOne() para insertar el documento
        collection.insertOne(object, (err, res) => {
            if (err) throw err;
            console.log("Documento insertado");
            client.close();
        });
    });
}





