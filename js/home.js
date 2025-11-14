(function(){
    var section2
    iniAdjust()
    iniKeyFrames()
    function iniAdjust(){
        var section1 = document.getElementById("section-1")
        section2 = document.getElementById("section-2")
        var section2P0 = document.querySelector("#section-2 .part-0")
        var p1Cards = document.querySelectorAll("#section-2 .part-1 .card")
        var section4 = document.getElementById("section-4")
        var menu = document.getElementById("menu")
        changeClass(document.body, "not-loaded", "loaded")
        adjust()
        addEvent(window, "resize", adjust)
        function adjust(){
            var wh = window.innerHeight
            var ww = window.innerWidth
            var mh = menu.clientHeight
            section1.style.minHeight = (wh - mh).toString() + "px"
            section2.style.minHeight = (wh * 1.5).toString() + "px"
            section4.style.minHeight = wh.toString() + "px"
            if(ww >= 850){
                section2P0.style.minHeight = wh.toString() + "px"
            }
            else{
                section2P0.style.minHeight = ""
            }
            interactiveScrolling()
            function interactiveScrolling(){
                var topOffset
                for(var i = 0; i < p1Cards.length; i++){
                    var card = p1Cards[i]
                    if(i != 0){
                        card.style.marginTop = Math.abs(wh - card.clientHeight).toString() + "px"
                    }
                    else{
                        if(ww >= 850){
                            topOffset = Math.abs(wh - card.clientHeight) / 2;
                        }
                        else{
                            topOffset = section2P0.clientHeight
                            if(topOffset + card.clientHeight > wh){
                                topOffset = wh - card.clientHeight - 50
                            }
                        }
                        card.style.top = topOffset.toString() + "px"
                    }
                    if(i != 0) card.style.top = (topOffset + (i * 50)).toString() + "px"
                }
            }
        }
    }
    function iniKeyFrames(){
        heroSection()
        section3Items()
        scrollNShow()
        function heroSection(){
            var e1 = document.querySelector("#section-1 .part-1 :nth-child(1)")
            var e2 = document.querySelector("#section-1 .part-2 :nth-child(1)")
            var i1 = document.querySelector("#section-1 .part-1 img")
            var i2 = document.querySelector("#section-1 .part-2 img")

            changeClass(e1, "", "animate")
            setTimeout(e2Anime, 800)
            setTimeout(i1Anime, 1600)
            setTimeout(i2Anime, 1800)

            function e2Anime(){
                changeClass(e2, "anime-delay", "animate")
            }
            function i1Anime(){
                changeClass(i1, "anime-delay", "animate")
            }
            function i2Anime(){
                changeClass(i2, "anime-delay", "animate")
            }
        }
        function section3Items(){
            var items = document.querySelectorAll("#section-3 .short-list .item")
            for(var i = 0; i < items.length; i++){
                var item = items[i]
                item.setAttribute("data-playtime", 1000 * (i * .2))
                changeClass(item, "", ["scroll-n-view", "timeline-based"])
            }
        }
    }
})()