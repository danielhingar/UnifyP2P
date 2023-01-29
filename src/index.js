const express = require('express');
const { chromium } = require('playwright');
const xirr = require("xirr");
const MongoClient = require('mongodb').MongoClient;

const app = express();

const PORT = process.env.PORT || 3000;

async function getBeneficios() {
    var now = new Date();
    var isoString = now.toISOString();
    var fecha = new Date(isoString);
    let beneficios = [];
    const browser = await chromium.launch({ headless: true });

    const pagePeerBerry = await browser.newPage();
    await pagePeerBerry.goto('https://peerberry.com/es/client/overview');
    await pagePeerBerry.fill('form > div:nth-child(1) > div > div > input', 'danielhingar@gmail.com');
    await pagePeerBerry.fill('form > div:nth-child(2) > div > div > input', 'PEople3012');
    await pagePeerBerry.getByRole('button', { name: 'Iniciar sesión' }).click();
    let benefecioPeerBerry = await pagePeerBerry.innerText("div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-sm-12.MuiGrid-grid-md-8 > div > div:nth-child(1) > div > div > div:nth-child(3) > div:nth-child(3) > div:nth-child(2) >span");
    let totalPeerBerry = await pagePeerBerry.innerText("div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-sm-12.MuiGrid-grid-md-8 > div > div:nth-child(1) > div > div > div:nth-child(1) > div > div:nth-child(1) > div");
    let peerBerry = new Plataforma(totalPeerBerry, benefecioPeerBerry, fecha, '0.0');
    beneficios.push(peerBerry);
    insertarRegistros("Peerberry",peerBerry)

    // const pageMintos = await browser.newPage();
    // await pageMintos.goto('https://www.mintos.com/es/general/');
    // await pageMintos.fill('#login-username','danielhingar@gmail.com');
    // await pageMintos.fill('#login-password','PEople3012');
    // await pageMintos.getByRole('button', { name:'Entrar'}).click();
    // let totalMintos = await pageMintos.innerText('div.m-u-color-n2.m-u-padding-bottom-7.m-u-padding-top-6 > div > div.m-o-grid > div:nth-child(1) > div > h2');
    // let beneficioMintos = await pageMintos.innerText('div.m-u-color-n2.m-u-padding-bottom-7.m-u-padding-top-6 > div > div.m-o-grid > div:nth-child(2) > div > div:nth-child(5) > span.m-u-nowrap');
    // let mintos = new Plataforma('Mintos', totalMintos, beneficioMintos, fecha.toLocaleDateString(), '0.0');
    // beneficios.push(mintos);

    const pageRobocash = await browser.newPage();
    await pageRobocash.goto('https://robo.cash/es/cabinet/summary');
    await pageRobocash.fill('#auth_email', 'danielhingar@gmail.com');
    await pageRobocash.fill('#auth_password', 'PEople3012');
    await pageRobocash.getByRole('button', { name: 'ENTRAR' }).click();
    let beneficioRobocash = await pageRobocash.innerText("div.col-sm-12.col-md-6.col-lg-4.earned_interests > div > div.white-block-body > div.left.value > span > span");
    let totalRobocash = await pageRobocash.innerText("div > div.col-lg-12 > div > div:nth-child(1) > div > div.white-block-body > div.left.value.digit > span > span");
    let bonusRobocash = await pageRobocash.innerText("div > div.col-lg-12 > div > div.col-sm-12.col-md-6.col-lg-4.earned_bonuses > div > div.white-block-body > div.left.value > span > span");
    let robocash = new Plataforma(totalRobocash, beneficioRobocash, fecha, bonusRobocash);
    beneficios.push(robocash);
    insertarRegistros("Robocash",robocash);

    const pageEsketit = await browser.newPage();
    await pageEsketit.goto('https://esketit.com/investor');
    await pageEsketit.fill('#email', 'danielhingar@gmail.com');
    await pageEsketit.fill('#password', 'PEople3012');
    await pageEsketit.getByRole('button', { name: 'Login' }).click();
    let beneficioEsketit = await pageEsketit.innerText("section.section-details.py-5 > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > div.text-right");
    let totalEsketit = await pageEsketit.innerText("section.section-details.py-5 > div > div > div:nth-child(1) > div > div:nth-child(1) > div.panel-row.mb-3.mt-3 > div.text-right");
    let bonusEsketit = await pageEsketit.innerText("section.section-details.py-5 > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(4) > div.text-right");
    let esketit = new Plataforma(totalEsketit, beneficioEsketit, fecha, bonusEsketit);
    beneficios.push(esketit);
    insertarRegistros("Esketit",esketit);


    const pageBrickstarter = await browser.newPage();
    await pageBrickstarter.goto('https://brickstarter.com/panel/mis-inversiones');
    await pageBrickstarter.fill('form > input:nth-child(2)', 'danielhingar@gmail.com');
    await pageBrickstarter.fill('form > input:nth-child(3)', 'PEople3012');
    let button = await pageBrickstarter.locator('input.button.button--full.button--mvl-full.\\|.mt-16');
    await button.click();
    let beneficioBrickstarter = await pageBrickstarter.innerText("#inmuebles- > div > a > div.property__info.\\|.clearfix.pt-24.ph-24.pb-32 > div:nth-child(9) > h4");
    let totalBrickstarter = await pageBrickstarter.innerText("#inmuebles- > div > a > div.property__info.\\|.clearfix.pt-24.ph-24.pb-32 > div:nth-child(8) > h4");
    let bonusBrickstarter = '15 €';
    let brickstarter = new Plataforma(totalBrickstarter, beneficioBrickstarter, fecha, bonusBrickstarter);
    beneficios.push(brickstarter);
    insertarRegistros("Brickstarter",brickstarter)

    

    const pageLendermarket = await browser.newPage();
    await pageLendermarket.goto('https://app.lendermarket.com/es/resumen');
    await pageLendermarket.getByRole('textbox', { name: 'Correo electrónico' }).fill('danielhingar@gmail.com');
    await pageLendermarket.getByRole('textbox', { name: 'Contraseña' }).fill('PEople3012');
    await pageLendermarket.getByRole('button', { name: 'Iniciar Sesión' }).click();
    let beneficioLendermarket = await pageLendermarket.innerText("div:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > span");
    let totalLendermarket = await pageLendermarket.innerText("div:nth-child(1) > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > span");
    let bonusLendermarket = await pageLendermarket.innerText("div:nth-child(2) > div > table > tbody > tr:nth-child(5) > td:nth-child(2) > span");
    let lendermarket = new Plataforma(totalLendermarket, beneficioLendermarket, fecha, bonusLendermarket);
    beneficios.push(lendermarket);
    insertarRegistros("Lendermarket",lendermarket)


    browser.close();
    console.log('Finalizado');
    return beneficios;

};



app.get("/", async (req, res) => {
    console.time('Inicio');
    const beneficios = await getBeneficios();
    console.timeEnd('Inicio');
    res.send(beneficios);
});

// app.get("/xirr", async (req, res) => {
//     console.time('Inicio xirr');
//     const xirr = await getXirr();
//     console.timeEnd('Inicio xirr');
//     res.send(xirr);
// });

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});

class Plataforma {
    constructor(total, beneficioBruto, date, bonus) {
        this.total = convertirPrecioANumero(total);
        this.beneficioBruto = convertirPrecioANumero(beneficioBruto);
        this.beneficioNeto = convertirPrecioANumero((this.beneficioBruto - (this.beneficioBruto * 0.19)).toFixed(2));
        this.bonus = convertirPrecioANumero(bonus);
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


// async function getXirr() {
//     const jsonData = [
//         {
//             when: new Date(2022,11,28),
//             amount: -10
//         },
//         // {
//         //     when: new Date(2022,9,7),
//         //     amount: -10
//         // },
//         // {
//         //     when: new Date(2022,10,4),
//         //     amount: -10
//         // },
//         // {
//         //     when: new Date(2022,10,1),
//         //     amount: 30.09
//         // },
//         // {
//         //     when: new Date(2022,10,20),
//         //     amount: 30.22
//         // },
    
//         // {
//         //     when: new Date(2022,11,1),
//         //     amount: 30.32
//         // },
//         // {
//         //     when: new Date(2022,11,8),
//         //     amount: 30.42
//         // },
//         // {
//         //     when: new Date(2022,11,23),
//         //     amount: 30.52
//         // },
//         // {
//         //     when: new Date(2022,12,1),
//         //     amount: 30.62
//         // },
//         // {
//         //     when: new Date(2022,12,8),
//         //     amount: 30.09
//         // },
//         // {
//         //     when: new Date(2023,1,1),
//         //     amount: 30.71
//         // },
//         // {
//         //     when: new Date(2023,1,12),
//         //     amount: 30.85
//         // },
//         {
//             when: new Date(2023,1,21),
//             amount: 10.33
//         }
//     ]
//     ;
    
//     // Calcular xirr utilizando los datos del json
//     const xirrValue = xirr(jsonData);
//     console.log(xirrValue); 

    
// }

function insertarRegistros(collectionName,object) {
const url = "mongodb+srv://danhingar:PEople3012@platforms.tvx1l8a.mongodb.net/?retryWrites=true&w=majority";

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