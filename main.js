header = ""

var data;
var slider;
var titleCont;
$.getJSON("./DataGenerator/fileDump.json", function(json) {
    data = json
    var tl = data["series"]
    tl = tl.concat(data["movies"])
    var rand = Math.floor(Math.random() * tl.length)
    rand  = 1 //dev reasons, remove for release
    slider = new Vue({
        el: "#vue_slider",
        data:{
            title:tl[rand],
        },
        methods: {
            getBackgroundStyle: function(str) {
                console.log(str)
                return "background-image:url("+header + str+");"
            },
            getType: function(){
                if (this.title.hasOwnProperty("main_id")) {
                    return "Film"
                }
                else {
                    return "TV Show"
                }
            },
            getReticle: function(rating) {
                if (rating > 6){
                    ratingColor = "#42b740"
                    ratingColorBack = "#def6de"
                }
                else{
                    ratingColor = "#FF4343"
                    ratingColorBack = "FFEBEB"
                }

                return "<div class='circle-rating-pro' data-value='"+rating/10+"' data-animation-start-value='"+rating/10+"' data-size='70' data-thickness='6' data-fill='{&quot;color&quot;: &quot;"+ratingColor+"&quot;}' data-empty-fill='"+ratingColorBack+"' data-reverse='true'><span style='color:"+ratingColor+";'>"+rating+"</span></div>"
                //return "<div class='circle-rating-pro' data-value='0.82' data-animation-start-value='0.82' data-size="70" data-thickness="6" data-fill="{&quot;color&quot;: &quot;#42b740&quot;}" data-empty-fill="#203521" data-reverse="true"><span style="color:#42b740;">8.2</span></div>"
            },
            getColor: function(rating) {
                if (rating > 7){return "green"}
                if (rating > 5){return "orange"}
                return "red"
            },
            getAddress: function() {
                if(this.title.hasOwnProperty("id")){
                    return "view.html?id="+this.title["id"]
                }
                else {
                    return "view.html?id="+this.title["title"]
                }
            }
        }
    })

    titleCont = new Vue({
        el:"#pannelCont",
        data:{
            titles:data["series"],
            header: "TV Shows"
        },
        methods: {
            addheader: function(str) {
                return header + str
            },
            getColorHex: function(rating, bool) {
                if (rating > 6){
                    ratingColor = "#42b740"
                    ratingColorBack = "#def6de"
                }
                else{
                    ratingColor = "#FF4343"
                    ratingColorBack = "FFEBEB"
                }

                if(bool){return ratingColor}
                else{return ratingColorBack}
            },
            getColor: function(rating) {
                if (rating > 7){return "green"}
                if (rating > 5){return "orange"}
                return "red"
            },
            getaddress: function(obj) {
                if(obj.hasOwnProperty("id")){
                    return "view.html?id="+obj["id"]
                }
                else {
                    return "view.html?id="+obj["title"]
                }
            }
        }
    })
});

function render(list) {
    var rand = Math.floor(Math.random() * list.length)
    slider.title = list[rand]
    titleCont.titles = list

}

$(".men_item").on('click', function() {
    $(".men_item").removeClass("current-menu-item")
    $(this).addClass("current-menu-item")
    if ($(this).find("a").text().replace(/\s/g,'') == "Movies") {
        titleCont.titles = data["movies"]
        titleCont.header = "Movies"
    }
    else{
        titleCont.titles = data["series"]
        titleCont.header = "TV Shows"
    }

})

$(".genre_button").on("click", function() {
    $(".genre_button").removeClass("active")
    $(this).addClass("active")
    var genre = $(this).find("h6").text().replace(/\s/g,'')
    var list = []
    for (var i = 0; i<data["movies"].length; i++) {
        if (data["movies"][i]["genres"].indexOf(genre) >= 0) {
            list.push(data["movies"][i])
        }
    }
    for (var i = 0; i<data["series"].length; i++) {
        if (data["series"][i]["genres"].indexOf(genre) >= 0){
            list.push(data["series"][i])
        }
    }
    titleCont.header = genre
    titleCont.titles = list

})
