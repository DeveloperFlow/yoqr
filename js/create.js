var typesManager

(function(){
    var resultBox = document.getElementById("result")
    var downloadBtn = document.getElementById("download-btn")
    var Qr
    var N
    var createBtn
    var options = {
        colorLight: "#f00",
        colorDark: "#0ff",
        width: 250,
        height: 250
    }
    

    qrTypeIni()
    changeClass(document.body, "not-loaded", "")
    scrollNShow()
    resizeEvt()
    colorPickerIni()
    logoIni()
    createBtnIni()
    downloadBtnIni()
    
    function createCode(){
      if(isEmpty(options.text) || !options.text){
          N = new notification("Please input the neccessary details","#f00")
          return
      }
      if(!Qr){
          remove(resultBox.children[0])
      }
      else{
          Qr.clear()
      }
      Qr = new QRCode(resultBox,options)
      downloadBtn.disabled = false
    }
    function colorPickerIni(){
        var pickers = document.getElementsByClassName("colorpicker")
        for(var i = 0; i < pickers.length; i++){
            var picker = pickers[i]
            var corInputId = picker.name
            var corInput = document.getElementById(corInputId)
            corInput.value = picker.value
            options[corInput.name] = picker.value
            assignEvent(picker,corInput)
        }
        function assignEvent(picker,corInput){
            picker.onchange = function(){
              corInput.value = picker.value
              options[corInput.name] = picker.value
            }
            corInput.onchange = function(){
              picker.value = corInput.value
              if(corInput.value == picker.value){
                options[corInput.name] = picker.value
              }
            }
        }
    }
    function logoIni(){
        var logoPicker = document.getElementById("logo-picker")
        var real = document.getElementById("real-logo-picker")
        var logos = [
          "img/email-logo.png",
          "img/fb.png",
          "img/phone-logo.png",
          "img/scan-me.png",
          "img/scan-me-frame.png"
         ]
        var previews = document.getElementById("logo-preview")
        var noLogo
        var selected
        var selectedLogo
        var fr
        logoPicker.onclick = function(){
            real.click()
        }
        real.onchange = logoFromDevice
        prepareAvailable()
        
        function prepareAvailable(){
            //first, the no logo option
            var noLogo = addLogo("img/cancel.png")[0]
            chooseLogo(noLogo)
            assignChooseEvent(noLogo)
            
            for(var i = 0; i < logos.length; i++){
                var thisLogo = addLogo(logos[i])
                assignChooseEvent(thisLogo[0],thisLogo[1])
            }
        }
        function addLogo(src){
            var btn = document.createElement("button")
            var logo = document.createElement("img")
            logo.src = src
            logo.className = "logo"
            btn.appendChild(logo)
            previews.appendChild(btn)
            return [btn,logo]
        }
        function assignChooseEvent(logoBtn,logo){
            logoBtn.onclick = function(){
                chooseLogo(logoBtn,logo)
            }
        }
        function chooseLogo(logoBtn,logo){
            if(selected){
                changeClass(selected,"chosen","")
            }
            changeClass(logoBtn,"","chosen")
            selected = logoBtn
            selectedLogo = logo
            if(selectedLogo){
              options.logo = selectedLogo.src
            }
            else{options.logo = undefined}
        }
        function logoFromDevice(){
            if(real.files && real.files[0]){
                var file = real.files[0]
                if(!fr){
                  fr =new FileReader()
                  fr.onload = function(){
                      var logo = addLogo(fr.result)
                      assignChooseEvent(logo[0],logo[1])
                      chooseLogo(logo[0],logo[1])
                  }
                }
                fr.readAsDataURL(file)
            }
        }
    }
    function createBtnIni(){
        createBtn = document.getElementById("create-btn")
        createBtn.onclick = createQr
        function createQr(){
            options.text = typesManager.currentType.toPlainText()
            if(!options.text || isEmpty(options.text)){
                return
            }
            createCode()
        }
    }
    function downloadBtnIni(){
      downloadBtn.onclick = function(){
          Qr.download("yoqr" + (Math.ceil(Math.random() * 100000)).toString())
      }
    }
    function qrTypeIni(){
        var container = document.getElementById("qr-types")
        for(var i = 0; i < container.children.length; i++){
            var qrType = container.children[i]
            switch(qrType.id){
                case("web-type"):
                  forWeb();
                  break;
                case("text-type"):
                  forText(); break;
                case("phone-type"):
                  forPhone(); break;
                case("sms-type"):
                  forSms(); break;
                case("whatsapp-type"):
                  forWhatsapp(); break;
                case("app-type"):
                  forApp(); break;
                case("email-type"):
                  forEmail(); break;
                case("vcard-type"):
                  forVcard(); break;
                case("wifi-type"):
                  forWifi(); break;
            }
            qrType.setAttribute("data-playtime", i * 200)
            changeClass(qrType, "", ["scroll-n-view", "timeline-based"])
        }
    }
    function resizeEvt(){
        addEvent(window,"resize",handle)
        function handle(){
            var dim = elementDim(resultBox)
            if(dim.w > 400){dim.w = 400}
            options.width = dim.w - 20
            options.height = options.width
        }
        handle()
    }
})()

function forWeb(){
  var ini = document.getElementById("web-type")
  var inter = document.getElementById("for-url")
  var webObj = new qrType(undefined,ini)
  webObj.inter = inter
  webObj.toPlainText = function(){
      var input = document.getElementById("site-url")
      var errorBox = document.getElementById("url-error")
      var error = ""
      var inputCoord = input.getBoundingClientRect()
      if(isEmpty(input.value)){
         error = "Please input site url"
      }
      else if(!(isWebUrl(input.value))){
         error = "Please input a valid website url"
       }
      if(!isEmpty(error)){
         errorBox.innerHTML = error
         scrollTo(inputCoord.top,0)
         return
      }
      errorBox.innerHTML = ""
      return encodeURI(input.value)
  }
  typesManager = new TypesManager(webObj)
}
function forText(){
  var ini = document.getElementById("text-type")
  var inter = document.getElementById("for-text")
  inter.style.display = "block"
  remove(inter)
  var txtObj = new qrType(undefined,ini)
  txtObj.inter = inter
  txtObj.toPlainText = function(){
      var input = document.getElementById("text-input")
      var errorBox = document.getElementById("text-error")
      var error = ""
      if(isEmpty(input.value)){
          error = "Please input text"
      }
      errorBox.innerHTML = error
      if(!(isEmpty(error))){
          scrollTo(input.getBoundingClientRect().top,0)
          return false
      }
      return input.value
  }
}
function forPhone(){
  var ini = document.getElementById("phone-type")
  var inter = document.getElementById("for-phone")
  inter.style.display = "block"; remove(inter)
  var phoneObj = new qrType(undefined,ini)
  phoneObj.inter = inter
  phoneObj.toPlainText = function(){
      var input = document.getElementById("phone-input")
      var errorBox = document.getElementById("phone-error")
      var error = ""
      var number = trim(input.value)
      if(isEmpty(number)){
          error = "Please input phone number"
      }
      else{
          var numberClean = number
          if(numberClean[0] == "+"){
             numberClean = numberClean.replace(/\+/,"")
          }
          numberClean = numberClean.replace(/\d/g,"")
          if(numberClean.length > 0){
              error = "Please input a valid phone number"
          }
          numberClean = null
      }
      errorBox.innerHTML = error
      if(!(isEmpty(error))){
          scrollTo(input.getBoundingClientRect().top,0)
          return false
      }
      return encodeURI("tel:" + number.toString())
  }
}
function forSms(){
    var ini = document.getElementById("sms-type")
    var smsObj = new qrType(smsConstructor,ini)
    var phoneInput
    var messageInput
    function smsConstructor() {
      // Create the outer div
      var div = document.createElement('div');
      //create the header
      var h2 = document.createElement("h2")
      h2.textContent = "Sms"
      //phone input
      phoneInput = new customInput()
      phoneInput.spanLabel.textContent = "Phone Number"
      phoneInput.input.placeholder = "Input Phone Number"
      //message input
      messageInput = new customInput()
      messageInput.spanLabel.textContent = "Message"
      var textArea = document.createElement("textarea")
      messageInput.input.parentElement.replaceChild(textArea,messageInput.input)
      messageInput.input = textArea
      messageInput.input.placeholder = "Input message"
      messageInput.container.style.marginTop = "3%"
      append(div,[
        h2,
        phoneInput.container,
        messageInput.container
       ])
      // Return the created element
      return div
    }
    smsObj.toPlainText = function(){
      var phoneInputEl = phoneInput.input
      var errorBox = phoneInput.spanError
      var error = ""
      var number = trim(phoneInputEl.value)
      if(isEmpty(number)){
          error = "Please input phone number"
      }
      else{
          var numberClean = number
          if(numberClean[0] == "+"){
             numberClean = numberClean.replace(/\+/,"")
          }
          numberClean = numberClean.replace(/\d/g,"")
          if(numberClean.length > 0){
              error = "Please input a valid phone number"
          }
          numberClean = null
      }
      errorBox.innerHTML = error
      if(!(isEmpty(error))){
          scrollTo(phoneInputEl.getBoundingClientRect().top,0)
          return false
      }
      return encodeURI("sms:" + number.toString() + "?body=" + messageInput.input.value)
  }
}
function forWhatsapp(){
    var ini = document.getElementById("whatsapp-type")
    var waObj = new qrType(waConstructor,ini)
    var phoneInput
    var messageInput
    function waConstructor() {
      // Create the outer div
      var div = document.createElement('div');
      //create the header
      var h2 = document.createElement("h2")
      h2.textContent = "Whatsapp"
      //phone input
      phoneInput = new customInput()
      phoneInput.spanLabel.textContent = "Phone Number"
      phoneInput.input.placeholder = "Input Phone Number with country code"
      //message input
      messageInput = new customInput()
      messageInput.spanLabel.textContent = "Message"
      var textArea = document.createElement("textarea")
      messageInput.input.parentElement.replaceChild(textArea,messageInput.input)
      messageInput.input = textArea
      messageInput.input.placeholder = "Input message"
      messageInput.container.style.marginTop = "3%"
      append(div,[
        h2,
        phoneInput.container,
        messageInput.container
       ])
      // Return the created element
      return div
    }
    waObj.toPlainText = function(){
      var phoneInputEl = phoneInput.input
      var errorBox = phoneInput.spanError
      var error = ""
      var number = trim(phoneInputEl.value)
      if(isEmpty(number)){
          error = "Please input phone number"
      }
      else{
          var numberClean = number
          if(numberClean[0] == "+"){
             numberClean = numberClean.replace(/\+/,"")
          }
          numberClean = numberClean.replace(/\d/g,"")
          if(numberClean.length > 0){
              error = "Please input a valid phone number"
          }
          numberClean = null
      }
      errorBox.innerHTML = error
      if(!(isEmpty(error))){
          scrollTo(phoneInputEl.getBoundingClientRect().top,0)
          return false
      }
      return encodeURI("https://wa.me/" + number.toString() + "?text=" + messageInput.input.value)
  }
}
function forApp(){
    var ini = document.getElementById("app-type")
    var appObj = new qrType(appConstructor,ini)
    var playInput
    var appInput
    function appConstructor() {
      // Create the outer div
      var div = document.createElement('div');
      //create the header
      var h2 = document.createElement("h2")
      h2.textContent = "App Download"
      //play store input
      playInput = new customInput()
      playInput.spanLabel.textContent = "Play Store App Link"
      playInput.input.placeholder = "Input Google Play Store App Link"
      //app store input
      appInput = new customInput()
      appInput.spanLabel.textContent = "Apple App Store App Link"
      appInput.input.placeholder = "App Store Link"
      appInput.container.style.marginTop = "3%"
      append(div,[
        h2,
        playInput.container,
        appInput.container
       ])
      // Return the created element
      return div
    }
    appObj.toPlainText = function(){
      var pslink = playInput.input.value
      var aslink = appInput.input.value
      var pserror = ""
      var aserror = ""
      var error = false
      if(isEmpty(pslink) && isEmpty(aslink)){
          pserror = "Please input app link on google play store"
          aserror = "Please input app link on apple app store"
          error = true
      }
      else{
          if(!(isWebUrl(pslink)) && !(isEmpty(pserror))){
              pserror = "Please Input a valid url"
              error = true
          }
          if(!(isWebUrl(aslink)) && !(isEmpty(aslink))){
              aserror = "Please input a valid app store link"
              error = true
          }
      }
      playInput.spanError.innerHTML = pserror
      appInput.spanError.innerHTML = aserror
      if(error){
          scrollTo(playInput.input.getBoundingClientRect().top,0)
          return false
      }
      return encodeURI("https://developerflow.github.io/yoqr/app.html?playstore=" + pslink + "&appstore=" + aslink)
  }
}
function forEmail(){
    var ini = document.getElementById("email-type")
    var emailObj = new qrType(emailConstructor,ini)
    var emailInput
    var subjectInput
    var messageInput
    function emailConstructor() {
      // Create the outer div
      var div = document.createElement('div');
      //create the header
      var h2 = document.createElement("h2")
      h2.textContent = "Email"
      //email input
      emailInput = new customInput()
      emailInput.spanLabel.textContent = "Email Address"
      emailInput.input.placeholder = "Input Email Address"
      emailInput.input.type = "email"
      //subject input
      subjectInput = new customInput()
      subjectInput.spanLabel.textContent = "Email Subject"
      subjectInput.input.type = "text"
      subjectInput.input.placeholder = "Input Email Subject"
      subjectInput.container.style.marginTop = "3%"
      //message input
      messageInput = new customInput()
      messageInput.spanLabel.textContent = "Message"
      var textArea = document.createElement("textarea")
      messageInput.input.parentElement.replaceChild(textArea,messageInput.input)
      messageInput.input = textArea
      messageInput.input.placeholder = "Input message"
      messageInput.container.style.marginTop = "3%"
      append(div,[
        h2,
        emailInput.container,
        subjectInput.container,
        messageInput.container
       ])
      // Return the created element
      return div
    }
    emailObj.toPlainText = function(){
      var emailInputEl = emailInput.input
      var errorBox = emailInput.spanError
      var error = ""
      var email = trim(emailInputEl.value)
      if(isEmpty(email)){
          error = "Please input email address"
      }
      else if(!(isEmail(email))){
          error = "please input a valid email address"
      }
      errorBox.innerHTML = error
      if(!(isEmpty(error))){
          scrollTo(emailInputEl.getBoundingClientRect().top,0)
          return false
      }
      return encodeURI("mailto:" + email + "?body=" + messageInput.input.value + "&subject=" + subjectInput.input.value)
  }
}
function forWifi(){
    var ini = document.getElementById("wifi-type")
    var wifiObj = new qrType(wifiConstructor,ini)
    var ssidInput
    var nwtInput
    var nwtOpt = [
      {label:"WES",value:"wes"},
      {label:"WPA",value:"Wpa"},
      {label:"No Authentication",value:"nopass"}
    ]
    var pwInput
    var h
    function wifiConstructor() {
      // Create the outer div
      var div = document.createElement('div');
      //create the header
      var h2 = document.createElement("h2")
      h2.textContent = "Wifi"
      //ssid input
      ssidInput = new customInput()
      ssidInput.spanLabel.textContent = "SSID"
      ssidInput.input.placeholder = "Input Network SSID"
      ssidInput.input.type = "text"
      //flex container
      var npc = document.createElement("div")
      npc.style.marginTop = "3%"
      npc.className = "flex vcenter apart"
      //network type input
      nwtInput = document.createElement("select")
      nwtInput.style.width = "25%"
      nwtInput.style.padding = " 3%"
      for(var i = 0; i < nwtOpt.length; i++){
          var opt = document.createElement("option")
          opt.value = nwtOpt[i].value
          opt.innerHTML = nwtOpt[i].label
          nwtInput.appendChild(opt)
      }
      //passwod input
      pwInput = new customInput()
      pwInput.spanLabel.textContent = "Password"
      pwInput.input.placeholder = "Input Password"
      pwInput.container.style.width = "70%"
      append(npc,[nwtInput,pwInput.container])
      //whether or not device is hjdden
      var hc = document.createElement("div")
      hc.className = "flex vcenter full-width"
      hc.style.marginTop = "3%"
      h = document.createElement("input")
      h.type = "checkbox"
      var label = document.createElement("span")
      label.className = "small-text"
      label.style.marginLeft = "2%"
      label.innerHTML = "Hidden"
      append(hc,[h,label])
      append(div,[
        h2,
        ssidInput.container,
        npc,
        hc
       ])
      // Return the created element
      return div
    }
    wifiObj.toPlainText = function(){
      var ssidInputEl = ssidInput.input
      var ssidErrorBox = ssidInput.spanError
      var ssidError = ""
      var ssid = ssidInputEl.value
      var pwInputEl = pwInput.input
      var pwErrorBox = pwInput.spanError
      var pwError = ""
      var pw = pwInputEl.value
      if(isEmpty(ssid)){
          ssidError = "Please input network ssid"
      }
      if(nwtInput.value != "nopass" && isEmpty(pw)){
          pwError = "Please input wifi password"
      }
      ssidErrorBox.innerHTML = ssidError
      pwErrorBox.innerHTML = pwError
      if(!(isEmpty(ssidError)) || !(isEmpty(pwError))){
          scrollTo(ssidInputEl.getBoundingClientRect().top,0)
          return false
      }
      var sc = ["\\","\"",",",":",";"]
      for(var i = 0; i < sc.length; i++){
        var c = sc[i]
        if(c == "\\"){
          c += "\\"
        }
        var regex = new RegExp(c,"g")
        var escapeChar = "\\"
        ssid = ssid.replace(regex,escapeChar + sc[i])
      }
      return "WIFI:T:" + nwtInput.value + ";S:" + ssid + ";P:" + pw + ";H:" + h.checked.toString() + ";;"
  }
}
function forVcard(){
  var ini = document.getElementById("vcard-type")
  var vcardObj = new qrType(vcardConstructor,ini)
  var fNameInput,lNameInput,pnInput,hpnInput,orgInput,orgTInput,faxInput,addrInput,cityInput,pcInput,countryInput,emailInput,websiteInput
  function vcardConstructor(){
      // Create the outer div
      var div = document.createElement('div');
      //create the header
      var h2 = document.createElement("h2")
      h2.textContent = "Vcard"
      //name input
      var nameDiv = document.createElement("div")
      nameDiv.className= "flex vcenter apart"
      fNameInput = new customInput()
      fNameInput.input.placeholder = "Input First Name"
      fNameInput.spanLabel.textContent = "First Name"
      fNameInput.container.style.width = "48%"
      lNameInput = new customInput()
      lNameInput.input.placeholder = "Input Last Name"
      lNameInput.spanLabel.textContent = "Last Name"
      lNameInput.container.style.width = "48%"
      append(nameDiv,[fNameInput.container,lNameInput.container])
      //phone number Input
      var pnDiv = document.createElement("div")
      pnDiv.className= "flex vcenter apart"
      pnDiv.style.marginTop = "4%"
      pnInput = new customInput()
      pnInput.input.placeholder = "Input Phone Number"
      pnInput.spanLabel.textContent = "Phone Number"
      pnInput.container.style.width = "48%"
      hpnInput = new customInput()
      hpnInput.input.placeholder = "Input Phone Number"
      hpnInput.spanLabel.textContent = "Mobile"
      hpnInput.container.style.width = "48%"
      append(pnDiv,[pnInput.container,hpnInput.container])
      //internet contact
      var iDiv = document.createElement("div")
      iDiv.className= "flex vcenter apart"
      iDiv.style.marginTop = "4%"
      emailInput = new customInput()
      emailInput.input.placeholder = "Input Email Address"
      emailInput.spanLabel.textContent = "Email Address"
      emailInput.container.style.width = "48%"
      websiteInput = new customInput()
      websiteInput.input.placeholder = "Input Website URL"
      websiteInput.spanLabel.textContent = "Website"
      websiteInput.container.style.width = "48%"
      append(iDiv,[emailInput.container,websiteInput.container])
      // physical contact
      addrInput = new customInput()
      addrInput.input.placeholder = "Input Address"
      addrInput.spanLabel.textContent = "Address"
      addrInput.container.style.marginTop = "4%"
      
      var addrDiv1 = document.createElement("div")
      addrDiv1.className= "flex vcenter apart"
      addrDiv1.style.marginTop = "4%"
      countryInput = new customInput()
      countryInput.input.placeholder = "Input Country"
      countryInput.spanLabel.textContent = "Country"
      countryInput.container.style.width = "48%"
      cityInput = new customInput()
      cityInput.input.placeholder = "Input City"
      cityInput.spanLabel.textContent = "City"
      cityInput.container.style.width = "48%"
      
      var addrDiv2 = document.createElement("div")
      addrDiv2.className= "flex vcenter apart"
      addrDiv2.style.marginTop = "4%"
      pcInput = new customInput()
      pcInput.input.placeholder = "Input Post Code"
      pcInput.spanLabel.textContent = "Post Code"
      pcInput.container.style.width = "48%"
      faxInput = new customInput()
      faxInput.input.placeholder = "Fax"
      faxInput.spanLabel.textContent = "Fax"
      faxInput.container.style.width = "48%"
      append(addrDiv1,[countryInput.container,cityInput.container])
      append(addrDiv2,[pcInput.container,faxInput.container])
      
      //organization
      var orgDiv = document.createElement("div")
      orgDiv.className= "flex vcenter apart"
      orgDiv.style.marginTop = "4%"
      orgInput = new customInput()
      orgInput.input.placeholder = "Input Place Of Work"
      orgInput.spanLabel.textContent = "Organization"
      orgInput.container.style.width = "48%"
      orgTInput = new customInput()
      orgTInput.input.placeholder = "Input Job Title"
      orgTInput.spanLabel.textContent = "Job Title"
      orgTInput.container.style.width = "48%"
      append(orgDiv,[orgInput.container,orgTInput.container])
      
      append(div,[h2,nameDiv,pnDiv,iDiv,addrInput.container,addrDiv1,addrDiv2,orgDiv])
      return div
  }
  vcardObj.toPlainText = function(){
      var fName = fNameInput.input.value
      var lName = lNameInput.input.value
      var error = false
      var fNameError = ""
      var lNameError = ""
      if(isEmpty(fName)){
          error = true
          fNameError = "Please Input First Name"
      }
      if(isEmpty(lName)){
          error = true
          lNameError = "Please Input Last Name"
      }
      fNameInput.spanError.innerHTML = fNameError
      lNameInput.spanError.innerHTML = lNameError
      if(error){
          scrollTo(fNameInput.container.getBoundingClientRect().top,0)
          return false
      }
      var pn = pnInput.input.value
      var hpn = hpnInput.input.value
      var org = orgInput.input.value
      var orgTitle = orgTInput.input.value
      var fax = faxInput.input.value
      var addr = addrInput.input.value
      var city = cityInput.input.value
      var postcode = pcInput.input.value
      var country = countryInput.input.value
      var email = emailInput.input.value
      var website = websiteInput.input.value
      var vcard = "BEGIN:VCARD\n"
      vcard += "VERSION:2.1\n"
      vcard += "N;CHARSET=UTF-8:" + fName + ";" + lName + "\n"
      vcard += "FN;CHARSET=UTF-8:" + fName + " " + lName +"\n"
      vcard += "TEL;CELL:" + pn + "\n"
      vcard += "TEL;HOME;VOICE:" + hpn + "\n"
      vcard += "ORG;CHARSET=UTF-8:" + org + "\n"
      vcard += "TITLE;CHARSET=UTF-8:" + orgTitle + "\n"
      vcard += "TEL;WORK;FAX:" + fax + "\n"
      vcard += "ADR;CHARSET=UTF-8;WORK;PREF:;;" + addr + ";" + city + ";" + postcode + ";" + country + "\n"
      vcard += "EMAIL:" + email + "\n"
      vcard += "URL:" + website + "\n"
      vcard += "END:VCARD"
      return vcard
  }
}

function TypesManager(currentType){
    this.currentType = currentType
    var cssClass = "chosen"
    var typeField = document.getElementById("fields")
    
    this.openInterface = function(qrTypeObj){
        remove(this.currentType.inter)
        typeField.appendChild(qrTypeObj.inter)
        changeClass(this.currentType.opener,cssClass,"")
        changeClass(qrTypeObj.opener,"",cssClass)
        this.currentType = qrTypeObj
    }
}
/**
 * @param {Function} interfaceCreator
 * @param {Element} opener
*/
function qrType(interfaceCreator,opener){
    this.creator = interfaceCreator
    this.opener = opener
    var self = this
    opener.onclick = function(){
        if(!self.inter){
            self.inter = self.creator()
        }
        typesManager.openInterface(self)
    }
    this.toPlainText = function(){
        
    }
}
function customInput(){
      // Create the inner div with class 'input'
      var inputDiv = document.createElement('div');
      inputDiv.className = 'input';
      // Create the div for the span element
      var spanDiv = document.createElement('div');
      // Create the span element with class 'small-text' for 'sms'
      var span = document.createElement('span');
      span.className = 'small-text';
      // Append the span element to the div
      spanDiv.appendChild(span);
      // Append the div with the span element to the inner div
      inputDiv.appendChild(spanDiv);
      // Create the input element
      var input = document.createElement('input');
      // Append the input element to the inner div
      inputDiv.appendChild(input);
      // Create the error span element with class 'small-text error'
      var errorSpanDiv = document.createElement("div")
      var errorSpan = document.createElement('span');
      errorSpan.className = 'small-text error';
      // Append the error span element to the inner div
      errorSpanDiv.appendChild(errorSpan)
      inputDiv.appendChild(errorSpanDiv);
      
      this.spanLabel = span
      this.spanError = errorSpan
      this.input = input
      this.container = inputDiv
}