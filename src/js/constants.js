const NodeStl = require('node-stl');
const path = require('path');
const fs = require('fs');

// Constant variables used for shopping & delivery, product customization
// NOTE: change these values if you want to use these features
const EMAIL_HOST_NAME = 'zaccord.com';
const EMAIL_USER_NAME = 'info@zaccord.com';
const EMAIL_PASSWORD = 'Render11Render11';
const PAYLIKE_ID = '3105ef0c-fbe6-484c-add3-f71538d0d959';
const SESSION_SECRET = 'oKTgDM!A%fXH%J)Vf=90swRXnrJIZH80(vpeL8YV_zt2UdO!dbCDjQJWfuf:iF8R3O';
const SHIPPING_PRICE = 1690;
const SHIPPING_PRICE_GLS_H = 2390;
const SHIPPING_PRICE_GLS_P = 2290;
const SHIPPING_PRICE_PACKETA_H = 1390;
const SHIPPING_PRICE_PACKETA_P = 890;
const MONEY_HANDLE = 490;
const LIT_FORMS = ['Domború', 'Homorú', 'Sima'];
const LIT_PRICES = {'100': 1990, '150': 2990, '200': 3990};
const PRINT_COLORS = ['Fekete', 'Fehér', 'Kék', 'Zöld', 'Arany', 'Piros', 'Citromsárga'];
const HEX_ARR = ['#000000', '#ffffff', '#0089ff', '#7aff00', '#FFD700', '#FF0000', '#FFFF66',
  '#FFFF00'];
const LAYER_WIDTH_VALUES = [0.12, 0.2, 0.28];
const INFILL_VALUES = [10];
const PRINT_MATERIALS = ['PLA', 'ABS', 'PETG', 'TPU'];
const LAYER_WIDTH_VALUES_SLA = [0.05, 0.07, 0.1];
const INFILL_VALUES_SLA = ['Üreges', 'Tömör'];
const PRINT_TECHS = ['FDM', 'SLA'];
const MIN_PRICE = 1990;
const BOX_SIZES = [[18, 16, 5], [18, 7, 12], [15, 20, 15], [15, 20, 25], [30, 30, 20]];
const BILLINGO_API_KEY = '42ea6f08-96ff-11eb-bf9a-06ac9760f844'; // 'a871aa56-9b93-11eb-8491-0254eb6072a0';
const BILLINGO_PRODNUM_1 = 5221476; // 6821423 custom print
const BILLINGO_PRODNUM_2 = 6801120; // 6821424 lithophane
const BILLINGO_PRODNUM_3 = 6801096 // 6821436 fix product
const BILLINGO_BLOCK_ID = 72687 // 103163
const BILLINGO_CARD_NUM = 88662 // 88880
const BILLINGO_COD_ID = 5339382 // 6821455
const BILLINGO_DELIVERY_ID = 4990219 // 6821453
const PACKAGE_WIDTH = 3; // in cm
const SLA_MULTIPLIER = 1.6;
const BA_NUM = "11773449-02809630";
const BA_NAME = "Turcsán Edit";
const PRINT_SIZES_PLA = [350, 350, 400];
const PRINT_SIZES_SLA = [65, 115, 150];
const DELIVERY_TYPES = ['gls_h', 'gls_p', 'packeta_h', 'packeta_p'];

for (let i = 20; i <= 80; i += 20) {
  INFILL_VALUES.push(i);
}

const SCALE_VALUES = [];
for (let i = 0.5; i <= 1.0; i += 0.1) {
  SCALE_VALUES.push(Number(i.toFixed(2)));
}

const WALL_WIDTH_VALUES = [];
for (let i = 0.8; i <= 2.4; i += 0.4) {
  WALL_WIDTH_VALUES.push(Number(i.toFixed(2)));
}

const DR = __dirname.replace(path.join('js', 'includes'), '');

const FILES_TO_CACHE = [
  path.join(DR, 'animate', 'animate.css'),
  path.join(DR, 'js', 'includes', 'jq.js'),
  path.join(DR, 'js', 'includes', 'lazyLoad.js')
];

const COUNTRIES = ["Albánia", "Andorra", "Argentína", "Ausztrália", "Ausztria", "Azerbajdzsán",
    "Belgium", "Bosznia-Hercegovina", "Brazília", "Bulgária", "Kanada", "Chile", "Kína",
    "Horvátország", "Kuba", "Ciprus", "Cseh köztársaság", "Dánia", "Egyiptom", "Észtország",
    "Faroe-szigetek", "Finnország", "Franciaország", "Grúzia", "Németország", "Gibraltár",
    "Görögország", "Hong Kong", "Magyarország", "Izland", "India", "Indonézia", "Irán", "Irak",
    "Írország", "Izrael", "Olaszország", "Japán", "Kazahsztán", "Dél-Koreai Köztársaság",
    "Kuwait",
    "Lettország", "Liechtenstein", "Litvánia", "Luxemburg", "Makedónia", "Malajzia", "Málta",
    "Mexikó", "Monaco", "Marokkó", "Hollandia", "Új-Zéland", "Norvégia", "Paraguay",
    "Fülöp-szigetek", "Lengyelország", "Portugália", "Katar", "Románia", "Oroszország",
    "San Marino", "Szaud-Arábia", "Szlovákia", "Szlovénia", "Dél-afrikai Köztársaság",
    "Spanyolország", "Svédország", "Svájc", "Thaiföld", "Tunézia", "Törökország",
    "Türkmenisztán",
    "Ukrajna", "Egyesült Arab Emirátusok", "Egyesült Királyság", "Amerikai Egyesült Államok",
    "Uruguay", "Üzbégisztán", "Vatikáni városállam", "Venezuela", "Vietnám", "Szerbia",
    "Koszovó",
    "Montenegró"];

const FIX_ADD_CPRINT = 500;
const SUCCESS_RETURN = '{"success": true}';
const OWNER_EMAILS = []; //['mark@pearscom.com', 'turcsanmate113@gmail.com'];

// For printing
const B = 40; // build speed: 40mm/s
const N = 0.4; // nozzle size: 0.4mm
const T = 1; // thermal expansion
const De = 0.2; // default infill in percentage
const L = 0.2; // default layer height in mm
const M = 12; // cost/min in forint
const DENSITY = 1.24; // PLA density is 1.27 g/cm^3
const PRICE_PER_GRAMM = 8.77;

// Return the correct shipping price depending on the choice of service
function getShippingPrice(type) {
  if (type == 'gls_h') {
    return SHIPPING_PRICE_GLS_H;
  } else if (type == 'gls_p') {
    return SHIPPING_PRICE_GLS_P;
  } else if (type == 'packeta_h') {
    return SHIPPING_PRICE_PACKETA_H;
  } else {
    return SHIPPING_PRICE_PACKETA_P;
  }
}

// Create a piecewise defined function for smoothing out the price when its too big
function smoothPrice(P) {
  if (P <= 4900) {
    // f(x) = x
    return Math.round(P);
  } else {
    // f(x) = 70 * sqrt(x)
    return Math.round(Math.sqrt(P) * 70);
  }
}

/*
  ORIGINAL:
  function calcCPPrice(W, H, D) {
    // If price is above 5K Ft then free after work, otherwise add +1K Ft
    let price = Math.round(smoothPrice(((W / B) * (D / ((N / T) / De)) * (H / L)) / 60 * M));
    if (price < 5000) return (price + 1000);
    else return price;
  }
*/

function calcCPPrice(volume, area) {
  let outerShellVolume = 0.12 * area; // 100% infill
  let innerVolume = volume - outerShellVolume; // 20% infill
  let finalPrice = Math.round(outerShellVolume * DENSITY + innerVolume * DENSITY * 0.2) * PRICE_PER_GRAMM * 8;
  console.log('a', finalPrice < MIN_PRICE ? MIN_PRICE : finalPrice)
  return finalPrice < MIN_PRICE ? MIN_PRICE : finalPrice;
}

// Get volume and area
function getCoords(path) {
  let stl = new NodeStl(path, {density: DENSITY}); 
  let volume = stl.volume;
  let area = stl.area / 100;
  return [volume, area];
}

function getPrintTime(W, H, D) {
  return Math.round((W / B) * (D / ((N / T) / De)) * (H / L));
}

// Constants for reference page
const NUM_OF_COLS = 3;
const NUM_OF_IMGS = 3;

const REF_BG = `
  data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAA0NDQ0ODQ4QEA4UFhMWFB4bGRkbHi0gIiAiIC1EKjIqKjIqRDxJOzc7STxsVUtLVWx9aWNpfZeHh5e+tb75+f8BDQ0NDQ4NDhAQDhQWExYUHhsZGRseLSAiICIgLUQqMioqMipEPEk7NztJPGxVS0tVbH1pY2l9l4eHl761vvn5///CABEIA+cD5wMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAABf/aAAgBAQAAAACyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//xAAUEAEAAAAAAAAAAAAAAAAAAADQ/9oACAEBAAE/AHQn/8QAFBEBAAAAAAAAAAAAAAAAAAAAsP/aAAgBAgEBPwB4H//EABQRAQAAAAAAAAAAAAAAAAAAALD/2gAIAQMBAT8AeB//2Q==`;

// NOTE: change ADMIN constants if you want to use that feature
// Admin URLs (marked with capital letters), password & username
const ADMIN_LOGIN_URL = '/adminLogin';
const CONF_EMAIL_URL = '/sendConfEmail';
const STATUS_UPDATE_URL = '/updateOrderStatus';
const ADMIN_PAGE_ACCESS = '/lick_weebshit';
const ADMIN_UNAME = 'weebshit';
const ADMIN_PASSWORD = 'HJ!RCY~KuK(xhX2-';

module.exports = {
  'shippingPrice': SHIPPING_PRICE,
  'moneyHandle': MONEY_HANDLE,
  'countries': COUNTRIES,
  'minPrice': MIN_PRICE,
  'fixAddCprint': FIX_ADD_CPRINT,
  'successReturn': SUCCESS_RETURN,
  'calcCPPrice': calcCPPrice,
  'getPrintTime': getPrintTime,
  'getCoords': getCoords,
  'M': M,
  'numOfCols': NUM_OF_COLS,
  'numOfImgs': NUM_OF_IMGS,
  'filesToCache': FILES_TO_CACHE,
  'refBg': REF_BG,
  'printColors': PRINT_COLORS,
  'litForms': LIT_FORMS,
  'hexArr': HEX_ARR,
  'layerWidthValues': LAYER_WIDTH_VALUES,
  'infillValues': INFILL_VALUES,
  'scaleValues': SCALE_VALUES,
  'wallWidthValues': WALL_WIDTH_VALUES,
  'litPrices': LIT_PRICES,
  'adminLoginUrl': ADMIN_LOGIN_URL,
  'confEmailUrl': CONF_EMAIL_URL,
  'statusUpdateUrl': STATUS_UPDATE_URL,
  'adminPageAccess': ADMIN_PAGE_ACCESS,
  'adminUname': ADMIN_UNAME,
  'adminPassword': ADMIN_PASSWORD,
  'ownerEmails': OWNER_EMAILS,
  'printMaterials': PRINT_MATERIALS,
  'emailHostName': EMAIL_HOST_NAME,
  'emailUsername': EMAIL_USER_NAME,
  'emailPassword': EMAIL_PASSWORD,
  'paylikeID': PAYLIKE_ID,
  'sessionSecret': SESSION_SECRET,
  'layerWidthValuesSLA': LAYER_WIDTH_VALUES_SLA,
  'infillValuesSLA': INFILL_VALUES_SLA,
  'printTechs': PRINT_TECHS,
  'boxSizes': BOX_SIZES,
  'billingoProdnum1': BILLINGO_PRODNUM_1,
  'billingoProdnum2': BILLINGO_PRODNUM_2,
  'billingoProdnum3': BILLINGO_PRODNUM_3,
  'billingoBlockID': BILLINGO_BLOCK_ID,
  'billingoCardNum': BILLINGO_CARD_NUM,
  'billingoAPIKey': BILLINGO_API_KEY,
  'billingoCodID': BILLINGO_COD_ID,
  'billingoDeliveryID': BILLINGO_DELIVERY_ID,
  'packageWidth': PACKAGE_WIDTH,
  'slaMultiplier': SLA_MULTIPLIER,
  'baNum': BA_NUM,
  'baName': BA_NAME,
  'printSizesPLA': PRINT_SIZES_PLA,
  'printSizesSLA': PRINT_SIZES_SLA,
  'getShippingPrice': getShippingPrice,
  'shippingPriceGLSH': SHIPPING_PRICE_GLS_H,
  'shippingPriceGLSP': SHIPPING_PRICE_GLS_P,
  'shippingPricePacketaH': SHIPPING_PRICE_PACKETA_H,
  'shippingPricePacketaP': SHIPPING_PRICE_PACKETA_P,
  'deliveryTypes': DELIVERY_TYPES
};
