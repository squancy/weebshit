// Countries for billing
let countries = ["Albánia", "Andorra", "Argentína", "Ausztrália", "Ausztria", "Azerbajdzsán",
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

function getBillingFields() {
  let billingName = _('billingName').value;
  let billingPcode = _('billingPcode').value;
  let billingCity = _('billingCity').value;
  let billingAddress = _('billingAddress').value;
  let billingCountry = _('billingCountry').value;
  let billingCompname, billingCompnum;
  billingCompname = billingCompnum = null;
  if (_('buyAsComp').checked) {
    billingCompname = _('billingCompname').value;
    billingCompnum = _('billingCompnum').value;
  }
  return [billingName, Number(billingPcode), billingCountry, billingCity, billingAddress,
    billingCompname, billingCompnum];
}

// User submits order, process their request
function submitOrder() {
  // Gather form values
  let uvet = _('uvet').checked; 
  let transfer = _('transfer').checked;
  let name = _('name').value;
  let pcode = Number(_('pcode').value);
  let city = _('city').value;
  let address = _('address').value;
  let mobile = _('mobile').value;
  let toAddr = _('toAddr').checked;
  let packetPoint = _('packetPoint').checked;
  let isCompNormal = _('compNormal').checked;

  let buyAsComp = _('buyAsComp') ? _('buyAsComp').checked : null;
  if (_('billingName')) {
    var [billingName, billingPcode, billingCountry, billingCity, billingAddress,
      billingCompname, billingCompnum] = getBillingFields();
  }
  
  let isLoggedIn = _('nlEmail') ? false : true;
  let nlEmail = _('nlEmail') ? _('nlEmail').value : null;

  // Company data if customer buys product as a company
  if (isCompNormal) {
    var normalCompnum = _('normalCompnum').value;
    var normalCompname = _('normalCompname').value;
  }

  _('errStatus').innerHTML = '';
  _('succStatus').innerHTML = '';

  // Make sure payment option is selected & delivery data is filled in
  let billingType = 'same';
  let isAgree = _('agree').checked;
  let isAgree2 = _('agree2').checked;
  if (!uvet && !transfer) {
    statusFill('errStatus', 'Kérlek válassz egy fizetési módot');
    return;
  } else if (!name || !pcode || !city || !address || !mobile) {
    statusFill('errStatus', 'Kérlek töltsd ki a szállítási adatokat');
    return;
  } else if (!Number.isInteger(pcode) || pcode < 1000 || pcode > 9985) {
    statusFill('errStatus', 'Kérlek valós irányítószámot adj meg');
    return;
  } else if (!isAgree || !isAgree2) {
    // Did not accept the terms & policy
    statusFill('errStatus', 'Fogadd el az ÁSZF-et és az Adatvédelmi Nyilatkozatot');
    return;
  } else if (_('billingName') && (billingName || billingPcode.value || billingCity ||
    billingAddress || _('billingCompname') && (billingCompname || billingCompnum))) {
    let isComp = false;
    let isCompNormal = false;
    if (_('billingCompname') && (billingCompname || billingCompnum || buyAsComp)) {
      isComp = true;
    } else if (isCompNormal && (!normalCompnum || !normalCompname)) {
      statusFill('errStatus', 'Kérlek adj meg minden céggel kapcsolatos adatot');
      return;
    } else if (normalCompnum && normalCompname && isCompNormal) {
      isCompNormal = true;
    }

    if (!validateComp(isComp)) return;
    else if (!isComp) billingType = 'diffNo';
    else billingType = 'diffYes';
  } else if (!toAddr && !packetPoint) {
    statusFill('errStatus', 'Válassz szállítási módot');
    return;
  } else if (packetPoint && !infoArr) {
    statusFill('errStatus', 'Válassz egy csomagpontot');
    return;
  }

  // Handle delivery to address & delivery to packet point
  if (toAddr) {
    data[0].delivery = 'toAddr';  
  } else {
    data[0].delivery = 'packetPoint';
    data[0].ppID = infoArr.pclshopid;
    data[0].ppName = infoArr.name;
    data[0].ppZipcode = infoArr.zipcode;
    data[0].ppCity = infoArr.city;
    data[0].ppAddress = infoArr.address;
    data[0].ppContact = infoArr.contact;
    data[0].ppPhone = infoArr.phone;
    data[0].ppEmail = infoArr.email;
    data[0].ppLat = infoArr.geolat;
    data[0].ppLon = infoArr.geolng;
  }

  /*
   Add payment & delivery data + login/registration credentials to the 1st element of the
   array
 */
  data[0].payment = 'transfer';
  data[0].isLoggedIn = isLoggedIn;
  data[0].name = name;
  data[0].pcode = pcode;
  data[0].city = city;
  data[0].address = address;
  data[0].mobile = mobile;
  data[0].billingType = billingType;
  data[0].billingName = _('billingName') ? billingName : '';
  data[0].billingCountry = _('billingCountry') ? billingCountry : '';
  data[0].billingPcode = _('billingPcode') ? billingPcode : '';
  data[0].billingCity = _('billingCity') ? billingCity : '';
  data[0].billingAddress = _('billingAddress') ? billingAddress : '';
  data[0].billingCompname = _('billingCompname') ? billingCompname : '';
  data[0].billingCompnum = _('billingCompname') ? billingCompnum : '';
  data[0].emailOutput = _('emlHolder').innerHTML;
  data[0].emailTotPrice = _('finalPrice').innerHTML;
  data[0].nlEmail = nlEmail;

  data[0].normalCompname = normalCompname;
  data[0].normalCompnum = normalCompnum;

  if (typeof isLit !== 'undefined') {
    data[0].isLit = true;
  } else {
    data[0].isLit = false;
  }

  if (uvet) data[0].payment = 'uvet';
  console.log(data);

  // Send data to server for further validation
  fetch('/validateOrder', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(data)
    }).then(response => response.json()).then(data => {
      if (data.success) {
        // On successful order remove items from the cookies (if order was not a single item)
        window.scrollTo(0, 0);
        if (isFromCart && !isFromCP) setCookie('cartItems', '', 365);

        // Remove custom printed product / lithophane from cart (cookies)
        let kvPairs = window.location.href.split('?')[1].split('&');
        if (kvPairs[0].split('=')[1] == 'lit') {
          var cpLitId = kvPairs[kvPairs.length - 2].split('=')[1]
        } else {
          var cpLitId = kvPairs[kvPairs.length - 1].split('=')[1]
        }

        cpLitId = cpLitId.replace(/\.(jpg|jpeg|png)/g, '');
        let cookieItems = JSON.parse(getCookie('cartItems') || '{}');
        delete cookieItems['content_' + cpLitId];
        setCookie('cartItems', JSON.stringify(cookieItems));

        _('main').classList = 'flexDiv';
        _('main').style.flexDirection = 'column';
        _('main').style.alignItems = 'center';
        _('main').innerHTML = `
          <img src="/images/icons/deliver.png" width="100">

          <p class="gotham font24" style="color: #4285f4;">Sikeres rendelés!</p>
          <p class="align dgray lh">
            A termékek legkésőbb a rendelés napjától számított 5. munkanapon házhoz lesznek
            szállítva.<br>
            Köszönjük, hogy a Zaccordot választottad!
          </p>
          <button class="btnCommon fillBtn" style="margin: 20px auto;"
          onclick="window.location.href='/'">
            Vissza a főoldalra
          </button>
        `;
        updateCartNum();
        fbq('track', 'AddPaymentInfo');
        /*
        fbq('track', 'Purchase', {
          value: (data[0].finalPrice + data[0].shippingPrice), currency: 'HUF'
        });
        */
    } else {
      console.log('adadsd');
      _('errStatus').innerHTML = '<p>Egy nem várt hiba történt, kérlek próbáld újra</p>';
    }
  }).catch(err => {
    console.log(err);
    _('errStatus').innerHTML = '<p>Egy nem várt hiba történt, kérlek próbáld újra</p>';
  });
}

// Validate parameters if user has a different billing address
function validateComp(isComp) {
  let [billingName, billingPcode, billingCountry, billingCity, billingAddress,
    billingCompname] = getBillingFields();
  if (!billingName || !billingCountry || !billingPcode || !billingCity || !billingAddress) {
    statusFill('errStatus', 'Kérlek tölts ki minden számlázási adatot'); 
    return false;
  } else if (!Number.isInteger(billingPcode) || billingPcode < 1000 || billingPcode > 9985) {
    statusFill('errStatus', 'Kérlek valós irányítószámot adj meg'); 
    return false;
  }

  if (!isComp) {
    return true;
  } else {
    if (!billingCompname || !billingCompnum) {
      statusFill('errStatus', 'Kérlek tölts ki minden céges számlázási adatot'); 
      return false; 
    }
    return true;
  }
}

let compAdded = false;

// Toggle 'different billing address' form
_('diffBilling').addEventListener('click', function toggleForm(e) { 
  if (this.getAttribute('data-status') != 'close') {
    _('diffBilling').innerText = 'Megegyező számlázási cím';
    _('billingForm').style.display = 'flex';
    if (_('bac')) _('bac').style.display = 'block';
    _('diffBilling').classList = `
    btnCommon fillBtn pad centr animate__animated animate__fadeIn
    `;

    _('billingForm').innerHTML = `
    <input type="text" class="dFormField" id="billingName" placeholder="Név"> 
    `; 

    _('billingHolder').classList = `animate__animated animate__fadeIn`;

    let res = '<select id="billingCountry" class="dFormField" style="margin-top: 0;">';
    for (let i = 0; i < countries.length; i++) {
    let selected = '';
    if (countries[i] === 'Magyarország') selected = 'selected';
    res += `<option value="${countries[i]}" ${selected}>${countries[i]}</option>`;
    }

    res += '</section>';
    res += `
      <input type="text" class="dFormField" id="billingPcode" placeholder="Irányítószám"> 
      <input type="text" class="dFormField" id="billingCity" placeholder="Város"> 
      <input type="text" class="dFormField" id="billingAddress"
      placeholder="Cím (hsz., em., ajtó)"> 
      `;

    if (!compAdded) {
      _('billingHolder').innerHTML += `
        <div class="align" style="margin: 10px 0 20px 0;" id="bac">
          <label class="chCont">Cégként vásárolok
            <input type="checkbox" id="buyAsComp"
              onchange="companyBilling('billingCompname', 'billingCompnum', 'billing',
                'billingForm')">
            <span class="cbMark"></span>
          </label>
        </div>
      `;
      compAdded = true;
    }

    _('billingForm').innerHTML += res;
    _('billingForm').classList = 'animate__animated animate__fadeIn';
    this.setAttribute('data-status', 'close');
  } else {
    _('diffBilling').innerText = 'Eltérő számlázási cím';
    _('billingHolder').classList = `animate__animated animate__fadeOut`;
    _('diffBilling').classList = `
      btnCommon fillBtn pad centr animate__animated animate__fadeIn
    `;
    _('billingForm').classList = 'animate__animated animate__fadeOut';
    _('billingForm').addEventListener('animationend', () => {
      if (_('billingForm').getAttribute('data-status') === 'close'
        && _('diffBilling').innerText[0] === 'E') {
        _('billingForm').style.display = 'none';
        if (_('bac')) {
          _('bac').style.display = 'none';
          _('buyAsComp').checked = false;
          toggleStates['billing'] = !toggleStates['billing'];
        }
      }
    });
    this.setAttribute('data-status', 'open');
  }
});

_('diffBilling').addEventListener('animationend', () => {
  _('diffBilling').classList = `btnCommon fillBtn pad centr`;
});

// Remove an element from DOM
function removeElement(id) {
  var elem = document.getElementById(id);
  if (!elem) return;
  return elem.parentNode.removeChild(elem);
}

function createInput(id, ph) {
  let inp = document.createElement('input');
  inp.type = 'text';
  inp.className = 'dFormField';
  inp.id = id;
  inp.placeholder = ph;
  return inp; 
}

// Toggle display company billing info
let toggleStates = {
  'billing': false,
  'normals': false
};

function companyBilling(nameID, numID, id, container) {
  if (!toggleStates[id]) {
    let compName = createInput(nameID, 'Cégnév');
    let compNum = createInput(numID, 'Adószám');
    _(container).appendChild(compName); 
    _(container).appendChild(compNum); 
    toggleStates[id] = true;
  } else {
    removeElement(nameID); 
    removeElement(numID); 
    toggleStates[id] = false;
  }
}

let isUvetAdded = false;
// If payment option is not transfer then count an extra price
function handleUvet(e, isUvet) {
  // Avoid click propagation on label
  if (e.target.tagName === 'DIV') {
    if (isUvet && !isUvetAdded) {
      _('fPrice').innerHTML = Number(_('fPrice').innerHTML) + MONEY_HANDLE;
      isUvetAdded = true;
    } else if (isUvetAdded) {
      _('fPrice').innerHTML = Number(_('fPrice').innerHTML) - MONEY_HANDLE;
      isUvetAdded = false;
    }
  }
}

let isInit = false;
function showMap(e) {
  const width  = window.innerWidth || document.documentElement.clientWidth || 
    document.body.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight || 
    document.body.clientHeight;

  _('overlay').style.opacity = '1';
  _('overlay').style.height = document.body.scrollHeight + "px";
  _('glsBigBox').style.height = '50vh';
  _('glsBigBox').style.opacity = '1';
  if (width > 768) {
    _('glsBigBox').style.width = Math.round(width * 0.7) + 'px';
    _('glsBigBox').style.left = Math.round(width * 0.15) + 'px';
  } else if (width > 500) {
    _('glsBigBox').style.width = Math.round(width * 0.9) + 'px';
    _('glsBigBox').style.left = Math.round(width * 0.05) + 'px';
  } else {
    _('glsBigBox').style.width = Math.round(width * 0.95) + 'px';
    _('glsBigBox').style.left = Math.round(width * 0.025) + 'px';
    _('glsBigBox').style.height = '85vh';
  }
  
  _('exitBtn').style.display = 'block';
  document.body.style.overflow = 'hidden';
  if (!isInit) {
    glsMap.init('HU', 'glsBigBox', '1116,Budapest,HU', 1);
    _('searchinput').classList = 'glsSearchInput';
    _('searchinput').placeholder = 'Csomagpont keresése...';

    var target = document.querySelector('#psitems-canvas')

    var observer = new MutationObserver(function(mutations) {
      // Attach an onclick event for every packet point div to get data from GLS
      let allDivs = document.querySelectorAll("#psitems-canvas > div");
      for (let i = 0; i < allDivs.length; i++) {
        if (allDivs[i].id) {
          allDivs[i].addEventListener('click', (e) => selectPacketPoint(e, allDivs[i]));
        }
      }
    });

    var config = { attributes: true, childList: true, characterData: true };

    observer.observe(target, config);
  }
  isInit = true;
}

let ajaxURL =
'//online.gls-hungary.com/psmap/psmap_getdata.php?ctrcode=HU&action=getList&dropoff=true';
let allPackets;
$.ajax({
  url: ajaxURL,
  cache: false,
  dataType: 'json',
  type: 'GET',
  async: false, 
  success: function (data, success) {
    allPackets = data;
  }
});

let infoArr;
function selectPacketPoint(e, pel) {
  exitMap(); 
  _('selectedPP').style.display = 'block';
  _('selectedPP').innerHTML = pel.innerHTML;

  for (let i = 0; i < allPackets.length; i++) {
    if (allPackets[i].pclshopid == pel.id) {
      infoArr = allPackets[i];
      break;
    }
  }
}

function glsPSMap_OnSelected_Handler(data) {
   console.log(data);
}

function exitMap() {
  _('glsBigBox').style.opacity = '0';
  _('overlay').style.opacity = '0';
  _('exitBtn').style.display = 'none';
  setTimeout(function removeOverlay() {
    _('overlay').style.height = '0';
    _('glsBigBox').style.height = '0';
  }, 500);
  document.body.style.overflow = 'auto';
}

_('uvetCont').addEventListener('click', (e) => handleUvet(e, true));
_('btransfer').addEventListener('click', (e) => handleUvet(e, false));
_('packetPointHolder').addEventListener('click', (e) => showMap(e));

// The following functions are used for selecting a packet point by GLS
var glsMap;
function initGLSPSMap() {
  glsMap = new GLSPSMap();
  google.maps.event.trigger(glsMap, 'resize');
}

$(document).ready(initGLSPSMap);

function glsPSMap_OnSelected_Handler(data) {
  $('#ajaxresult').html(data.pclshopid);
}

function testclick(obj) {
  glsMap.initAddress($('#testinput').val());
}

function highlightLabel(show, hide) {
  _(show).style.borderColor = '#c1c1c1';
  _(hide).style.borderColor = '#dfdfdf';
}

_('uvetCont').addEventListener('click', (e) => highlightLabel('uvetCont', 'btransfer'));
_('btransfer').addEventListener('click', (e) => highlightLabel('btransfer', 'uvetCont'));

_('packetPointHolder').addEventListener('click',
  (e) => highlightLabel('packetPointHolder', 'toAddrHolder'));
_('toAddrHolder').addEventListener('click',
  (e) => highlightLabel('toAddrHolder', 'packetPointHolder'));
