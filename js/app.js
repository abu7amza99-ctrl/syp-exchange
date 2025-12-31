let usdRate = 0;
let eurRate = 0;
let tryRate = 0;

// جلب سعر الدولار من SP-Today دمشق
async function loadRates() {
  try {
    const res = await fetch('https://sp-today.com/currency/us_dollar');
    const text = await res.text();

    const regex = /<td.*?>دمشق<\/td>\s*<td.*?>([\d.,]+)<\/td>/;
    const match = text.match(regex);
    if(match){
      usdRate = parseFloat(match[1].replace(/,/g,''));
    } else {
      usdRate = 11920;
    }

    eurRate = usdRate * 0.92;
    tryRate = usdRate * 28;

  } catch(e){
    console.error(e);
    usdRate = 11920;
    eurRate = usdRate * 0.92;
    tryRate = usdRate * 28;
  }
}

function rateOf(currency){
  if(currency === "SYP") return 1;
  if(currency === "SYP_NEW") return 100;
  if(currency === "USD") return usdRate;
  if(currency === "EUR") return eurRate;
  if(currency === "TRY") return tryRate;
  return 1;
}

function convert(){
  const amount = parseFloat(document.getElementById("amount").value);
  if(!amount) return;

  const from = document.getElementById("from").value;
  const to   = document.getElementById("to").value;

  let inSYP;
  if(from === "SYP") inSYP = amount;
  else if(from === "SYP_NEW") inSYP = amount * 100;
  else inSYP = amount * rateOf(from);

  let result;
  if(to === "SYP") result = inSYP;
  else if(to === "SYP_NEW") result = inSYP / 100;
  else result = inSYP / rateOf(to);

  let display = result.toLocaleString(undefined,{maximumFractionDigits:2});
  if(to === "SYP_NEW"){
    display = `<img src="assets/flags/syp_new.png" class="flag-icon"> ${display} ليرة سورية جديدة`;
  }

  document.getElementById("result").innerHTML = display;
}

// تحميل أولي + تحديث كل ساعة
loadRates();
setInterval(loadRates, 3600000);