(function(){
    fromCamIni()
    fromImgIni()
    
    function fromCamIni(){
        var ini = document.getElementById("from-cam")
        var camList = document.getElementById("camera-list")
        var camScanner = document.getElementById("cam-scanner")
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
            alert(decodedText + "\n" + decodedResult)
        };
        function failedCameraGet(err){
            var m = "Unable to access device camera " + err
            if(err.name == "NotAllowedError"){
                m = "Access to device camera is denied"
            }
            new notification(m,"#ffb630")
        }
    }
    function fromImgIni(){
        var real = document.getElementById("choose-img")
        real.onchange = startScan
        var ini = document.getElementById("from-img")
        ini.onclick = function(){real.click()}
        var qrc
        function startScan(){
            if(!qrc){
                qrc = new Html5Qrcode("file-reader")
            }
        }
    }
 })()