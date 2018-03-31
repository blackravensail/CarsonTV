

/*function render(list) {
    subList = [list[0],list[list.length-1]] //temporyPlaceHolder
    renderCenter(subList)

    for(var i = 0; i <list.length;i++){
        renderPannel(list[i])
    }
}

function renderCenter(list){
    obj = list[0]
    wideImg = obj["wide"]
    trailer = gateway + obj["trailer_id"]
    rating = obj["rating"]
    description = obj["description"]

    if (obj.hasOwnProperty("main_id")){
        type = "movie"
        Type = "Film"
    }
    else{
        type ="series"
        Type = "Tv Series"
    }

    if (rating > 7){
        ratingColor = "#42b740"
        ratingColorBack = "#def6de"
    }
    else if (rating > 0) {
        ratingColor = "#FF4343"
        ratingColorBack = "FFEBEB"
    }
    str = "<li class='progression_studios_animate_left'><div class='progression-studios-slider-dashboard-image-background' style='background-image:url("+wideImg+");'><div class='progression-studios-slider-display-table'><div class='progression-studios-slider-vertical-align'><div class='container'><a class='progression-studios-slider-play-btn afterglow' href='#VideoLightbox-1'><i class='fas fa-play'></i></a><video id='VideoLightbox-1' width='960' height='540'><source src='"+trailer+"' type='video/mp4'></video><div class='circle-rating-pro' data-value='"+rating/10+"' data-animation-start-value='"+rating/10+"' data-size='70' data-thickness='6' data-fill='{&quot;color&quot;: &quot;"+ratingColor+"&quot;}' data-empty-fill='"+ratingColorBack+"' data-reverse='true'><span style='color:"+ratingColorBack+";'>"+rating+"</span></div><div class='progression-studios-slider-dashboard-caption-width'><div class='progression-studios-slider-caption-align'><h6>"+Type+"</h6><ul class='progression-studios-slider-rating'>"+tags+"</ul><h2><a href='dashboard-movie-profile.html?type="+type+"&id="+id+"'>"+name+"</a></h2><ul class='progression-studios-slider-meta'><li>"+releaseData+"</li><li>"+lenght+" min.</li><li>"+genres+"</li></ul><p class='progression-studios-slider-description'>"+description+"</p><a class='btn btn-green-pro btn-slider-pro btn-shadow-pro afterglow' href='#VideoLightbox-1'><i class='fas fa-play'></i> Watch Trailer</a><div class='clearfix'></div></div></div></div></div></div><div class='progression-studios-slider-mobile-background-cover'></div></div></li>"

    $(".slides").append($(str))

    obj = list[1]
    wideImg = obj["wide"]
    trailer = gateway + obj["trailer_id"]
    rating = obj["rating"]
    description = obj["description"]

    if (obj.hasOwnProperty("main_id")){
        type = "movie"
        Type = "Film"
    }
    else{
        type ="series"
        Type = "Tv Series"
    }

    if (rating > 7){
        ratingColor = "#42b740"
        ratingColorBack = "#def6de"
    }
    else if (rating > 0) {
        ratingColor = "#FF4343"
        ratingColorBack = "FFEBEB"
    }

    str = "<li class='progression_studios_animate_center'><div class='progression-studios-slider-dashboard-image-background' style='background-image:url("+wideImg+");'><div class='progression-studios-slider-display-table'><div class='progression-studios-slider-vertical-align'><div class='container'><a class='progression-studios-slider-play-btn afterglow' href='#VideoLightbox-1'><i class='fas fa-play'></i></a><video id='VideoLightbox-1' width='960' height='540'><source src='"+trailer+"' type='video/mp4'></video><div class='circle-rating-pro' data-value='"+rating/10+"' data-animation-start-value='"+rating/10+"' data-size='70' data-thickness='6' data-fill='{&quot;color&quot;: &quot;"+ratingColor+"&quot;}' data-empty-fill='"+ratingColorBack+"' data-reverse='true'><span style='color:"+ratingColorBack+";'>"+rating+"</span></div><div class='progression-studios-slider-dashboard-caption-width'><div class='progression-studios-slider-caption-align'><h6>"+Type+"</h6><ul class='progression-studios-slider-rating'>"+tags+"</ul><h2><a href='dashboard-movie-profile.html?type="+type+"&id="+id+"'>"+name+"</a></h2><ul class='progression-studios-slider-meta'><li>"+releaseData+"</li><li>"+lenght+" min.</li><li>"+genres+"</li></ul><p class='progression-studios-slider-description'>"+description+"</p><a class='btn btn-green-pro btn-slider-pro btn-shadow-pro afterglow' href='#VideoLightbox-1'><i class='fas fa-play'></i> Watch Trailer</a><div class='clearfix'></div></div></div></div></div></div><div class='progression-studios-slider-mobile-background-cover'></div></div></li>"


    $(".slides").append($(str))

}

function renderPannel(obj) {
    if (obj.hasOwnProperty("main_id")){
        id = obj['main_id']
        type = "movie"
    }
    else {
        id = obj['title']
        type = "series"
    }
    name = obj["title"]
    tallImg = gateway + obj["tall"]
    rating = obj["rating"]


    $('#pannelCont').append($("<div class='col-12 col-md-6 col-lg-4 col-xl-3'><div class='item-listing-container-skrn'><a href='dashboard-movie-profile.html'><img src='"+ tallImg +"' alt='"+name+"'></a><div class='item-listing-text-skrn'><div class='item-listing-text-skrn-vertical-align'><h6><a href='dashboard-movie-profile.html?type="+type+"&id="+id+"'>"+name+"</a></h6><div class='circle-rating-pro' data-value='"+rating/10+"' data-animation-start-value="+rating/10+"' data-size='32' data-thickness='3' data-fill='{&quot;color&quot;: &quot;#42b740&quot;}' data-empty-fill='#def6de' data-reverse='true'><span style='color:#42b740;'>"+rating+"</span></div></div></div></div></div>"))
}*/


header = ""
data = {
    "movies": [{
        "rating": 7.6,
        "genres": ["Comedy", "Drama", "Family"],
        "description": "A coming-of-age story about a shy, young boy sent by his irresponsible mother to spend the summer with his wealthy, eccentric uncles in Texas.",
        "title": "Secondhand Lions",
        "release_date": 2003,
        "main_id": "QmPBZMM9EzLfZTf59qbGJ3pmMACpjDojwmMjnuMZZuupTv",
        "trailer_id": "QmeCy1167bNNKtbjYTb4RcYu38GNJteX82a4p3AXLt19uz",
        "duration": 111,
        "tall": "QmYHsAkxhjADBpnfYhj4y2guGkBr8FFZY12Mc5yFmygYLv",
        "wide": "images/seconhand.jpg"
    }],
    "series": [{
        "rating": 4.8,
        "genres": ["Animation", "Comedy", "Family", "Mystery", "Sci-Fi"],
        "description": "Three kids, Jackie, Matt, Inez, and their bird friend Digit, must save cyberspace from the evil Hacker with the use of strategy and math skills.",
        "title": "Cyberchase",
        "release_date": 2002,
        "trailer_id": "QmakHQ8Gb8gctj7kL2LQeLd2HtFm94Gvt3FCGLb9sRQ5A4",
        "ep_map": {
            "Season 1": [{
                "tall": "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
                "id": "Qmdiav56GaC1iEnwAm6B4vzLAE6K2THY6s6s5HvLa3hswZ",
                "title": "01 - Lost My Marbles"
            }, {
                "tall": "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
                "id": "Qmdiav56GaC1iEnwAm6B4vzLAE6K2THY6s6s5HvLa3hswZ",
                "title": "02 - Castleblanca"
            }]
        },
        "tall": "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
        "wide": "images/cyberchase.jpg"
    }]
}

var rand = Math.floor(Math.random() * data["series"].length)

var slider = new Vue({
    el: "#vue_slider",
    data:{
        title:data["series"][rand]
    },
    methods: {
        getBackgroundStyle: function(str) {
            console.log(str)
            return "background-image:url("+header + str+");"
        },
        getType: function(){
            console.log("hello, it's a me mario")
            window.rr = this.title
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

var titleCont = new Vue({
    el:"#pannelCont",
    data:{
        titles:data["series"]
    },
    methods: {
        addheader: function(str) {
            return header + str
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

            return "<div class='circle-rating-pro' data-value='"+rating/10+"' data-animation-start-value='"+rating/10+"' data-size='32' data-thickness='3' data-fill='{&quot;color&quot;: &quot;"+ratingColor+"&quot;}' data-empty-fill='"+ratingColorBack+"' data-reverse='true'><span style='color:"+ratingColor+";'>"+rating+"</span></div>"
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
function render(list) {
    var rand = Math.floor(Math.random() * list.length)
    slider.title = list[rand]
    titleCont.titles = list
}

//$("#tv_menu_item").on("click",function() {render(data["series"]})
//$("#movie_menu_item").on("click", function() {render(data["movies"}])

$(".genre_button").on('click', function() {
    $(".genre_button").removeClass("active")
    $(this).addClass("active")
    $(this).find("h6").value
})

$(".men_item").on('click', function() {
    $(".men_item").removeClass("current-menu-item")
    $(this).addClass("current-menu-item")
    if ($(this).find("a").text().replace(/\s/g,'') == "Movies") {
        render(data["movies"])
    }
    else{
        render(data["series"])
    }
})

$(".genre_button").on("click", function() {
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
    console.log(list)
    titleCont.titles = list
})
