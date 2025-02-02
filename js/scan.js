(function(){
    fromCamIni()
    fromImgIni()
    var resultInterface
    var fta = true
    function fromCamIni(){
        var ini = document.getElementById("from-cam")
        var camList = document.getElementById("camera-list")
        var camScanner = document.getElementById("cam-scanner")
        var closeScannerBtn = document.getElementById("close-scanner")
        closeScannerBtn.onclick = closeScanner
        remove(camScanner)
        camScanner.style.display = ""
        ini.onclick = camInter
        var cameras = []
        var qrc
        var config = {fps:10,qrbox:{width:250,height:250}}
        
        function camInter(){
            //get all the available cameras on the device
            Html5Qrcode.getCameras().then(getCameras).catch(failedCameraGet)
        }
        function openScanner(){
            document.body.appendChild(camScanner)
            qrc = new Html5Qrcode("reader");
            openCam()
        }
        function openCam(){
            qrc.start(cameras[0].id,config,onsuccess).catch(failedCameraGet);
        }
        function closeScanner(){
            qrc.stop().then(close).catch(error)
            function close(){
                cameras = []
                while(camList.children.length > 0){
                    remove(camList.children[0])
                }
                remove(camScanner)
            }
            function error(e){
                console.error(e)
                new notification("An error occured please refresh the page")
                close()
            }
        }
        function getCameras(cameraDevices){
            if(!cameraDevices || !cameraDevices.length){return}
            for(var i = 0; i < cameraDevices.length; i++){
                addToCameraList(cameraDevices[i])
            }
            /*
            The first camera in the cameras array is used to start scanning so sort this array to make sure that the back camera comes first, rhen the front then the rest can be in any order
            */
            for(var i = 0; i < cameras.length; i++){
                var camera = cameras[i]
                var ff = cameras[0]
                var isFront = /front/i
                var isBack = /back/i
                if(isBack.test(camera.label)){
                    cameras[0] = camera
                    cameras[i] = ff
                }
                else if(isFront.test(camera.label)){
                    if(isBack.test(ff.label)){
                        ff = cameras[1]
                        cameras[1] = camera
                        cameras[i] = ff
                    }
                    else{
                        cameras[0] = camera
                        cameras[i] = ff
                    }
                }
            }
            changeClass(cameras[0].button,"","current")
            openScanner()
        }
        function addToCameraList(device){
            cameras.push(device)
            var isFront = /front/i
            var isBack = /back/i
            var label = device.label
            if(isBack.test(label)){
                label = "Back Camera"
            }
            else if(isFront.test(label)){
                label = "Front Camera"
            }
            var iniCameraBtn = document.createElement("button")
            iniCameraBtn.innerHTML = label
            camList.appendChild(iniCameraBtn)
            device.button = iniCameraBtn
            iniCameraBtn.onclick = function(){
                var ff = cameras[0]
                for(var i = 0; i < cameras.length; i++){
                    if(cameras[i].id == device.id){
                      break
                    }
                }
                cameras[0] = device
                cameras[i] = ff
                changeClass(ff.button,"current","")
                changeClass(device.button,"","current")
                qrc.stop().then(openCam).catch(failedCameraGet)
            }
        }
        function onsuccess(decodedText,decodedResult){
            closeScanner()
            showResult(decodedText,decodedResult)
        };
        function failedCameraGet(err){
            var m = "Unable to access device camera " + err
            if(err.name == "NotAllowedError"){
                m = "Access to device camera is denied"
            }
            new notification(m,"#ffb630")
            fta = true
        }
    }
    
    function fromImgIni(){
        var real = document.getElementById("choose-img")
        real.oninput = startScan
        var ini = document.getElementById("from-img")
        ini.onclick = function(){real.click()}
        var qrc,stopScan
        function startScan(){
            var files = real.files
            if(!files || files.length < 1){
                return
            }
            var imgFile = files[0]
            if(!qrc){
                qrc = new Html5Qrcode("file-scanner")
            }
            stopScan = spinner(document.body,"#fff",{height: "100vh"})
            qrc.scanFile(imgFile).then(onsuccess,onfail)
        }
        function onsuccess(result,resultObj){
            showResult(result,resultObj)
            finish()
        }
        function onfail(err){
            new notification("The image you provided could not be decoded","#ffb630")
            finish()
        }
        function finish(){
            stopScan()
        }
    }
    function showResult(result){
        if(!resultInterface){
            resultInterface = new ResultTab()
        }
        resultInterface.open(result)
    }
    function detectType(result){
        var types = [
          [vcard,/BEGIN:VCARD/i],
          [link,/(https:\/\/|http:\/\/|www\.)/i],
          [phone,/tel:/i],
          [sms,/sms:/i],
          [email,/mailto:/i],
          [wifi,/WIFI:/i]
        ]
        var resultType = text
        for(var i = 0; i < types.length; i++){
            var type = types[i]
            if(type[1].test(result)){
                resultType = type[0]
                break
            }
        }
        return resultType
    }
    function link(r){
        resultInterface.changeType("web.png","Website")
        resultInterface.writeRaw(r)
        resultInterface.changeOpener("Open Website",o)
        function o(){
            open(r,"_blank")
        }
    }
    function text(r){
        resultInterface.changeType("text.png","Text")
        resultInterface.writeRaw(r)
        resultInterface.changeOpener("Copy Text",o)
        function o(){
            copy(r)
        }
    }
    function vcard(r){
        resultInterface.changeType("vcard.png","Vcard")
        resultInterface.writeRaw(r)
        resultInterface.changeOpener("Open Vcard",o)
        function o(){
            open("data:text/vcard;urlencoded," + encodeURI(r))
        }
    }
    function wifi(r){
        resultInterface.changeType("wifi.png","Wifi")
        resultInterface.writeRaw(r)
        resultInterface.hideOpener()
        
        var container = document.createElement("div")
        container.id = "wifi-details"
        
        var h = document.createElement("div")
        h.innerHTML = "Wifi Details"
        /*ssid*/
        var ssidFieldContainer = document.createElement("div")
        ssidFieldContainer.className = "flex vcenter apart field"
        
        var ssidFieldIc = document.createElement("div")
        ssidFieldIc.className = "field-input"
        ssidFieldIc.style.padding = "2%"
        
        var ssidFieldLabel = document.createElement("div")
        ssidFieldLabel.className = "small-text"
        ssidFieldLabel.innerHTML = "Network SSID"
        
        var ssidField = document.createElement("input")
        ssidField.disabled = true
        append(ssidFieldIc,[ssidFieldLabel,ssidField])
        var ssidCopy = document.createElement("img")
        ssidCopy.className = "icon"
        ssidCopy.src = "img/copy.png"
        ssidCopy.onclick = function(){
            copy(ssidField.value)
        }
        append(ssidFieldContainer,[ssidFieldIc,ssidCopy])
        
        /*password*/
        var pwFieldContainer = document.createElement("div")
        pwFieldContainer.className = "flex vcenter apart field"
        
        var pwFieldIc = document.createElement("div")
        pwFieldIc.className = "field-input"
        pwFieldIc.style.padding = "2%"
        
        var pwFieldLabel = document.createElement("div")
        pwFieldLabel.className = "small-text"
        pwFieldLabel.innerHTML = "Wifi Password"
        
        var pwField = document.createElement("input")
        pwField.disabled = true
        append(pwFieldIc,[pwFieldLabel,pwField])
        
        var pwCopy = document.createElement("img")
        pwCopy.className = "icon"
        pwCopy.src = "img/copy.png"
        pwCopy.onclick = function(){
            copy(pwField.value)
        }
        append(pwFieldContainer,[pwFieldIc,pwCopy])
        
        var ntc = document.createElement("div")
        ntc.className = "small-text space-up"
        ntc.innerHTML = "Network Security : "
        append(container,[h,ssidFieldContainer,pwFieldContainer,ntc])
        fillWifiDetails()
        resultInterface.addExtraField(container)
        function fillWifiDetails(){
            var wifiDet = r.slice(r.indexOf(":") + 1)
            if(wifiDet.length < 3){return}
            var labels = ["s:","t:","h:","p:"]
            var special = [":","\"",";","\\"]
            
            for(var i = 0; i < wifiDet.length; i++){
                var char = wifiDet[i]
                var nextChar = (i + 1 < wifiDet.length)? wifiDet[i + 1] : undefined
                if(nextChar && inarray(labels,char + nextChar,true) !== false && (i + 2) < wifiDet.length){
                    var c = i + 2
                    var label = char + nextChar
                    var value = ""
                    var p
                    for(c = c ; c < wifiDet.length; c++){
                        var part = wifiDet[c]
                        if(p && p == "\\"){
                            if(!(inarray(special,part))){
                                part = p + part
                            }
                            p = undefined
                        }
                        else if(part == "\\"){
                            p = "\\"
                            part = ""
                        }
                        else if(part == ";"){
                            switch(label.toLowerCase()){
                                case "s:":
                                    ssidField.value = value
                                    break
                                case "p:":
                                    pwField.value = value
                                    break
                                case "t:":
                                    ntc.innerHTML += value
                                    break
                                case "h:":
                                    if(equalString(value,"true")){
                                        pwField.type = "password"
                                    }
                                    break
                            }
                            i = c;
                            break
                        }
                        value += part
                    }
                }
            }
        }
    }
    function email(r){
        resultInterface.changeType("email.png","Email")
        resultInterface.writeRaw(r)
        resultInterface.changeOpener("Send Email",o)
        function o(){
            open(r)
        }
    }
    function sms(r){
        resultInterface.changeType("sms.png","SMS")
        resultInterface.writeRaw(r)
        resultInterface.changeOpener("Send SMS",o)
        function o(){
            open(r)
        }
    }
    function phone(r){
        resultInterface.changeType("phone.png","Phone Number")
        resultInterface.writeRaw(r)
        resultInterface.changeOpener("Call Number",o)
        function o(){
            open(r)
        }
    }
    function ResultTab(){
        var container = document.getElementById("result-fixed")
        var self = this
        this.closeBtn = document.getElementById("close-result")
        this.closeBtn.onclick = function(){self.close()}
        var typeIcon = document.getElementById("rt-img")
        var type = document.getElementById("rt")
        var rawResult = document.getElementById("rr")
        var rawResultCopy = document.getElementById("rr-copy")
        rawResultCopy.onclick = function(){
            copy(rawResult.innerHTML)
        }
        var extra = document.getElementById("r-extra")
        var openBtn = document.getElementById("ra")
        
        remove(container)
        container.style.display = ""
        this.open = function(result){
            document.body.appendChild(container)
            if(this.extraField){
                remove(this.extraField)
                this.extraField = undefined
            }
            openBtn.style.display = ""
            detectType(result)(result)
        }
        this.close = function(){
            remove(container)
            console.log(this)
        }
        this.changeType = function(icon,text){
            typeIcon.src = "img/" + icon
            type.textContent = text
        }
        this.writeRaw = function(result){
            rawResult.textContent = result
        }
        this.changeOpener = function(text,opener){
            openBtn.textContent = text
            openBtn.onclick = opener
        }
        this.hideOpener = function(){
            openBtn.style.display = "none"
        }
        this.addExtraField = function(field){
            extra.appendChild(field)
            this.extraField = field
        }
    }
 })()