(function(){
    iniTogglers()
    iniMenuToggler()
    iniSetYear()
    if(hasClass(document.body, "ini-anime")){
        changeClass(document.body, "not-loaded", "")
        scrollNShow()
    }
    
    function iniTogglers(){
        var togglers = document.getElementsByClassName("toggler")
        for(var i = 0; i < togglers.length; i++){
            var container = togglers[i]
            var toggler = container.children[0]
            assignToggle(container,toggler)
        }
        function assignToggle(container,toggler){
            toggler.onclick = function(){
                var open = hasClass(container,"open")
                if(open){
                    changeClass(container,"open","")
                }
                else{
                    changeClass(container,"","open")
                }
            }
        }
    }
    function iniMenuToggler(){
        var opener = document.getElementById("menu-ini")
        var closer = document.getElementById("ss-close")
        var ssCurtain = document.getElementById("ss-curtain")
        var menuEl = document.getElementById("menu")
        opener.onclick = function(){
            changeClass(menuEl,"","open")
        }
        closer.onclick = function(){
            changeClass(menuEl,"open","")
        }
        ssCurtain.onclick = closer.onclick
    }
    function iniSetYear(){
        var years = document.getElementsByClassName("year-temp")
        var year = new Date()
        year = year.getFullYear()
        for(var i = 0; i < years.length; i++){
            years[i].innerHTML = year
        }
    }
})()
function isWebUrl(url){
    var schemes = ["http://","https://"]
    var isUrl
    url = trim(url)
    //all urls should start with https://, http:// or www.
    var https = url.slice(0,schemes[1].length)
    var http = url.slice(0,schemes[0].length)
    var www = url.slice(0,4)
    var isHttps = (https == schemes[1])
    var isHttp = (http == schemes[0])
    var isWww = (www == "www.")
    isUrl = isHttp || isHttps || isWww
    if(!isUrl){
        return false
    }
    
    var scheme
    switch(true){
        case(isHttp):
            scheme = schemes[0]; break;
        case(isHttps):
            scheme = schemes[1]; break;
        case(isWww):
            scheme = "www"; break;
    }
    var restOfUrl = url.slice(scheme.length)
    if(restOfUrl.length < 3){
        return false
    }
    
    var domainNameEnd = restOfUrl.indexOf("/")
    domainNameEnd = (domainNameEnd == -1)? restOfUrl.length : domainNameEnd;
    var domainName = restOfUrl.slice(0,domainNameEnd)
    //domain name should have at least 2 levels
    var domainLevels = domainName.split(".")
    if(domainLevels.length < 2){
        return false
    }
    return true
}
function isEmail(email){
    var itis = false
    if(email.length < 6){
        return false
    }
    var parts = email.split("@")
    if(parts.length != 2){
        return false
    }
    var localPart = parts[0]
    var domainPart = parts[1]
    
    var r2 = /^[-_+.]/
    var r3 = /[-_+.]$/g
    var r4 = /[^\w\d\+_\.\-]/g
    if(r2.test(localPart) || r3.test(localPart) || r4.test(localPart) || r4.test(domainPart)){
        return false
    }
    return true
}
function spinner(container,bg,styles){
    var el = document.createElement("div")
    el.className = "spinner"
    var wrapper = document.createElement("div")
    wrapper.className = "absolute top left full-width flex vcenter hcenter spinner-wrapper"
    wrapper.style.height = "100%"
    var box = document.createElement("div")
    box.className = "minor-pad curved"
    box.appendChild(el)
    if(bg){box.style.background = bg}
    if(styles){
        for(style in styles){
            wrapper.style[style] = styles[style]
        }
    }
    wrapper.appendChild(box)
    var computedStyle = getComputedStyle(container)
    var formalPos = container.style.position
    if(!inarray(["absolute","fixed","relative"],computedStyle.position)){
        container.style.position = "relative"
    }
    container.appendChild(wrapper)

    return function(){
        container.style.position = formalPos;
        remove(wrapper)
    }
}