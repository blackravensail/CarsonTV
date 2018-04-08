header = "https://ipfs.io/ipfs/"
//header = "http://127.0.0.1:8080/ipfs/"
var slider;
var titleCont;
td = data["series"]
td = td.concat(data["movies"])


var rand = Math.floor((new Date()).getTime() / 100000) % td.length
var sliderTitle = td[rand]


console.log(sliderTitle)
slider = new Vue({
    el: "#vue_slider",
    data: {
        title: sliderTitle,
    },
    methods: {
        getBackgroundStyle: function(str) {
            return "background-image:url(" + header + str + ");"
        },
        getType: function() {
            if (this.title.hasOwnProperty("main_id")) {
                return "Film"
            } else {
                return "TV Show"
            }
        },
        getReticle: function(rating) {
            if (rating > 6) {
                ratingColor = "#42b740"
                ratingColorBack = "#def6de"
            } else {
                ratingColor = "#FF4343"
                ratingColorBack = "FFEBEB"
            }

            return "<div class='circle-rating-pro' data-value='" + rating / 10 + "' data-animation-start-value='" + rating / 10 + "' data-size='70' data-thickness='6' data-fill='{&quot;color&quot;: &quot;" + ratingColor + "&quot;}' data-empty-fill='" + ratingColorBack + "' data-reverse='true'><span style='color:" + ratingColor + ";'>" + rating + "</span></div>"
            //return "<div class='circle-rating-pro' data-value='0.82' data-animation-start-value='0.82' data-size="70" data-thickness="6" data-fill="{&quot;color&quot;: &quot;#42b740&quot;}" data-empty-fill="#203521" data-reverse="true"><span style="color:#42b740;">8.2</span></div>"
        },
        getColor: function(rating) {
            if (rating > 7) {
                return "green"
            } else if (rating > 5) {
                return "orange"
            } else {
                return "red"
            }
        },
        getAddress: function() {
            if (this.title.hasOwnProperty("id")) {
                return "view.html?id=" + this.title["id"]
            } else {
                return "view.html?id=" + this.title["title"]
            }
        }
    }
})

titleCont = new Vue({
    el: "#pannelCont",
    data: {
        titles: data["series"],
        header: "TV Shows"
    },
    methods: {
        addheader: function(str) {
            return header + str
        },
        getColorHex: function(rating, bool) {
            if (rating > 6) {
                ratingColor = "#42b740"
                ratingColorBack = "#def6de"
            } else {
                ratingColor = "#FF4343"
                ratingColorBack = "FFEBEB"
            }

            if (bool) {
                return ratingColor
            } else {
                return ratingColorBack
            }
        },
        getColor: function(rating) {
            if (rating > 7) {
                return "green"
            }
            if (rating > 5) {
                return "orange"
            }
            return "red"
        },
        getaddress: function(obj) {
            if (obj.hasOwnProperty("id")) {
                return "view.html?id=" + obj["id"]
            } else {
                return "view.html?id=" + obj["title"]
            }
        }
    }
})

//search("killer", true, true, "Drama", 4, 10)


$(".men_item").on('click', function() {
    $(".men_item").removeClass("current-menu-item")
    $(this).addClass("current-menu-item")
    if ($(this).find("a").text().replace(/\s/g, '') == "Movies") {
        titleCont.titles = data["movies"]
        titleCont.header = "Movies"
    } else {
        titleCont.titles = data["series"]
        titleCont.header = "TV Shows"
    }

})

$(".genre_button").on("click", function() {
    $(".genre_button").removeClass("active")
    $(this).addClass("active")
    var genre = $(this).find("h6").text().replace(/\s/g, '')
    var list = []
    for (var i = 0; i < data["movies"].length; i++) {
        if (data["movies"][i]["genres"].indexOf(genre) >= 0) {
            list.push(data["movies"][i])
        }
    }
    for (var i = 0; i < data["series"].length; i++) {
        if (data["series"][i]["genres"].indexOf(genre) >= 0) {
            list.push(data["series"][i])
        }
    }
    titleCont.header = genre
    titleCont.titles = list

})
/*
function search(query, movies, series, genre, minRating, maxRating) {
    console.log(query, movies, series, genre, minRating, maxRating)
    list = []
    if (movies) {
        for (i = 0; i < data["movies"].length; i++){
            if(data["movies"][i]["rating"] > minRating && data["movies"][i]["rating"] < maxRating) {
                console.log("Hola")
                if (genre == "0"){
                    list.push(data["movies"][i])
                }
                else if (data["movies"][i]['genres'].indexOf(genre) >= 0){
                    list.push(data["movies"][i])
                }
            }
        }
    }
    if (series) {
        for (i = 0; i < data["series"].length; i++){
            if(data["series"][i]["rating"] > minRating && data["series"][i]["rating"] < maxRating) {
                if (genre == "0"){
                    list.push(data["series"][i])
                }
                else if (data["series"][i]['genres'].indexOf(genre) >= 0){
                    list.push(data["series"][i])
                }
            }
        }
    }
    console.log(list)
    var obj = {}
    query = query.toLowerCase()
    query = query.replace(",","")
    queryl = query.split(' ')
    for(i = 0; i < list.length; i++) {
        rank = 0
        main = list[i]
        for(j = 0; j < queryl.length; i++){
            rank += count(main["title"], queryl[j])
            rank += count(main["description"], queryl[j])
        }
        obj[rank.toString() + "--" + Math.floor(Math.random() * 10000).toString()] = list[i]

    }

    keys = []

    for (k in obj) {
        if (myObj.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    keys.sort()
    nobj = []
    for(i = 0; i < keys.length;i++){
        nobj.push(obj[keys[i]])
    }

    titleCont.header = query
    titleCont.titles = nobj
}

function count(main_str, sub_str) {
    main_str += '';
    sub_str += '';

    if (sub_str.length <= 0) {
        return main_str.length + 1;
    }

   subStr = sub_str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
   return (main_str.match(new RegExp(subStr, 'gi')) || []).length;
}

function getSearchPrams() {
    var genre = $("#genreSearch option:selected").text()
    if (genre == "All Genres"){
        genre = "0"
    }
    range = $(".range-example-rating-input").val()
    range = range.split(',')
    range[0] = parseInt(range[0])
    range[1] = parseInt(range[1])
    if (range[0] <= range[1]) {
        minR = range[0]
        maxR = range[1]
    }
    else {
        minR = range[1]
        maxR = range[0]
    }
    search($("#searchBar").val(), $("#movies-type").attr("checked") == "checked", $("#tv-type").attr("checked") == "checked", genre, minR, maxR)
}

$("#searchButton").on("click", function() {
    getSearchPrams()
})*/
