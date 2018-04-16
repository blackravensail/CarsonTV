var url = new URL(window.location.href)
var id = url.searchParams.get("id")
var main_obj
var j = 0

var header = "https://ipfs.io/ipfs/"
//var header = "http://127.0.0.1:8080/ipfs/"
var sidebar
var main_area
var player

$("#seriesCont").hide()
var tl = data["series"]
tl = tl.concat(data["movies"])
for (var i = 0; i < tl.length; i++) {
    if (tl[i]["title"] == id) {
        main_obj = tl[i];
        sidebar = new Vue({
            el: "#content-sidebar-pro",
            data: {
                title: main_obj,
                header: header
            }
        })
        main_area = new Vue({
            el: "#col-main-with-sidebar",
            data: {
                title: main_obj,
                epMap: main_obj["ep_map"],
                currentSeasonName: "",
                currentSeason: [],
                header: header
            },
            methods: {
                getColor: function(rating) {
                    if (rating > 6) {
                        return "green"
                    }
                    return "red"
                },
                changeVideo: function(id) {
                    console.log("Hi")
                    $(window).scrollTo({left:0,top:0},800)
                    player.source = {
                        type: 'video',
                        title: "",
                        sources: [{
                            src: header + id,
                            type: 'video/mp4'
                        }]
                    }

                }
            }
        })
    }
}
player = new Plyr("#main_video", {
    ratio : "16:9"
})


if (main_obj.hasOwnProperty("ep_map")) {
    renderSeasons(main_obj["ep_map"])
    player.source = {
        type: 'video',
        title: main_obj["title"],
        sources: [{
            src: header + main_obj["trailer_id"],
            type: 'video/mp4'
        }]
    }

    $("#trailer_Button").hide()
} else {
    player.source = {
        type: 'video',
        title: main_obj["title"],
        sources: [{
            src: header + main_obj["main_id"],
            type: 'video/mp4'
        }]
    }

}
player.poster = header + main_obj["wide"]


$("#trailer_Button").on("click", function() {
    if (j % 2 == 0) {
        player.source = {
            type: 'video',
            title: main_obj["title"],
            sources: [{
                src: header + main_obj["trailer_id"],
                type: 'video/mp4'
            }]
        }

        $("#trailer_Button").html("<i class='fas fa-play'></i>Watch Film")
    } else {
        player.source = {
            type: 'video',
            title: main_obj["title"],
            sources: [{
                src: header + main_obj["main_id"],
                type: 'video/mp4'
            }]
        }

        $("#trailer_Button").html("<i class='fas fa-play'></i>Watch Trailer")
    }
    j++;
})

function renderSeasons(ep_map) {
    console.log("HI")
    $($(".seasonButton").get(0)).addClass("current")
    main_area.currentSeasonName = $($(".seasonButton").get(0)).text()
    main_area.currentSeason = ep_map[main_area.currentSeasonName]
    $(".seasonButton").on("click", function() {
        $(".seasonButton").removeClass("current")
        $(this).addClass("current")
        main_area.currentSeasonName = $(this).text()
        main_area.currentSeason = ep_map[main_area.currentSeasonName]
    })
    window.rr = $(".episode")
    $(".episode").on('click', function() {
        console.log("HIIIIIIII")
    })

    $("#seriesCont").show()

}

function changeVideo(id) {
    console.log("HIIII")
    console.log(id)
    player.source = {
        type: 'video',
        title: "",
        sources: [{
            src: header + id,
            type: 'video/mp4'
        }]
    }

}

function navtoLoc(loc, obj){
    str = loc + "?"
    for(key in obj){
        if (obj.hasOwnProperty(key)){
            str = str + key + "=" + obj[key]
            str += "&"
        }
    }
    str = str.slice(0, -1)
    window.location = str
}

function getSearchPrams() {
    var genre = $("#genreSearch option:selected").text()
    if (genre == "All Genres"){
        genre = "0"
    }
    console.log(genre)
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
    navtoLoc("index.html",{
        "search":true,
        "query": $("#searchBar").val(),
        "movies": ($("#movies-type").attr("checked") == "checked"),
        "series": ($("#tv-type").attr("checked") == "checked"),
        "genre": genre,
        "minRating": minR,
        "maxRating": maxR
    })
}

$("#searchButton").on("click", function() {
    getSearchPrams()
})
$("#searchBar").keydown(function(event) {
    if (event.keyCode === 13) {
        getSearchPrams();
    }
});

$("#mobileSearch").keydown(function(event) {
    if (event.keyCode === 13) {
        navtoLoc("index.html",{
            "search":true,
            "query": $("#mobileSearch").val(),
            "movies": true,
            "series": true,
            "genre": "0",
            "minRating": 0,
            "maxRating": 10
        })
    }
});

$(".movieButton").on('click', function() {
    navtoLoc("index.html",{"search":false})
})
