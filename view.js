var url = new URL(window.location.href)
var id = url.searchParams.get("id")

var j = 0
var k = 0

console.log(data)



JSONServer = "http://76.114.138.132:5000"

var main_obj
var type
var titleIndex
var cS
var cE
var playnext

var sidebar
var ratingBar
var desBox
var seaBox
var epBox
var player


/*
$.getJSON(JSONServer + "/json", function (json, status) {
    $(document).ready(function () {
        main(json);
    })
})
*/

$(document).ready(function () {
    main(data);
})


function main(data) {

    header = data['header']

    for (var i = 0; i < data["movies"].length; i++) {
        if (data["movies"][i]["imdb_id"] == id) {
            type = "movies"
            titleIndex = i
            defineVueElm();
        }
    }

    for (var i = 0; i < data["series"].length; i++) {
        if (data["series"][i]["imdb_id"] == id) {
            type = "series"
            titleIndex = i
            cS = data["series"][i]["cS"]
            cE = data["series"][i]["cE"]
            defineVueElm();
        }
    }

    player = new Plyr("#main_video", {
        ratio: "16:9"
    })

    if (type == "series") {
        $("#trailer_Button").hide()

        ratingBar.title = data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["title"]

        $($("#seriesCont").get(0)).find(".episode[data-sindex=" + cS + "][data-eindex=" + cE + "]").addClass("activeEpisode")


        $(".episode").on("click", function () {



            if ($(this).hasClass("activeEpisode")) {
                return;
            }

            console.log("Changing Episode")

            $(".episode").removeClass("activeEpisode")
            $(this).addClass("activeEpisode");


            cS = $(this).attr('data-sindex')
            cE = $(this).attr('data-eindex')

            ratingBar.title = data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["title"]

            if (data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["progress"] > 90) {
                data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["progress"] = 0
            }

            player.source = {
                type: 'video',
                title: data[type][titleIndex]["title"],
                sources: [{
                    src: header + data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["id"],
                    type: 'video/mp4'
                }]
            }

            $(window).scrollTo({
                left: 0,
                top: 0
            }, 800)
        })


        player.source = {
            type: 'video',
            title: data[type][titleIndex]["title"],
            sources: [{
                src: header + data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["id"],
                type: 'video/mp4'
            }]
        }
    } else {
        $("#seriesCont").hide()
        player.source = {
            type: 'video',
            title: data[type][titleIndex]["title"],
            sources: [{
                src: header + data[type][titleIndex]["main_id"],
                type: 'video/mp4'
            }]
        }
    }

    player.on('ready', event => {
        if (type == "series") {
            setTimeout(function () {
                player.currentTime = ((data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["progress"] / 100.0) * player.duration);
            }, 800);
        } else if (j % 2 == 0) {
            setTimeout(function () {
                player.currentTime = ((data[type][titleIndex]["progress"] / 100) * player.duration);
            }, 800);
        }
    });
    $('.seasonSlider').slick({
        slidesToShow: 4,
        slidesToScroll: 2,
        infinite: false,
        arrows: true,
        swipeToSlide: true
    });
}


function defineVueElm() {
    sideBar = new Vue({
        el: "#content-sidebar-pro",
        data: {
            title: data[type][titleIndex],
            header: header
        }
    })

    var tit

    if (type == "series") {
        tit = data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["title"]
    }

    ratingBar = new Vue({
        el: "#ratingBar",
        data: {
            rating: data[type][titleIndex]["rating"],
            title: tit
        },
        methods: {
            getColor: function (rating) {
                if (rating > 6) {
                    return "green"
                }
                return "red"
            }
        }
    })

    desBox = new Vue({
        el: "#desBox",
        data: {
            description: data[type][titleIndex]["description"]
        }
    })

    console.log(data[type][titleIndex]["ep_map"])

    if (type == "series") {
        epBox = new Vue({
            el: "#seriesCont",
            data: {
                ep_map: data[type][titleIndex]["ep_map"],
                header: header
            }
        })
    }
}







$("#trailer_Button").on("click", function () {
    if (j % 2 == 0) {
        player.source = {
            type: 'video',
            title: data[type][titleIndex]["title"],
            sources: [{
                src: header + data[type][titleIndex]["trailer_id"],
                type: 'video/mp4'
            }]
        }

        $("#trailer_Button").html("<i class='fas fa-play'></i>Watch Film")
    } else {
        player.source = {
            type: 'video',
            title: data[type][titleIndex]["title"],
            sources: [{
                src: header + data[type][titleIndex]["main_id"],
                type: 'video/mp4'
            }]
        }

        $("#trailer_Button").html("<i class='fas fa-play'></i>Watch Trailer")
    }
    j++;
})

function navtoLoc(loc, obj) {
    str = loc + "?"
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str = str + key + "=" + obj[key]
            str += "&"
        }
    }
    str = str.slice(0, -1)
    window.location = str
}

function getSearchPrams() {
    var genre = $("#genreSearch option:selected").text()
    if (genre == "All Genres") {
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
    } else {
        minR = range[1]
        maxR = range[0]
    }
    navtoLoc("index.html", {
        "search": true,
        "query": $("#searchBar").val(),
        "movies": ($("#movies-type").attr("checked") == "checked"),
        "series": ($("#tv-type").attr("checked") == "checked"),
        "genre": genre,
        "minRating": minR,
        "maxRating": maxR
    })
}

$("#searchButton").on("click", function () {
    getSearchPrams()
})
$("#searchBar").keydown(function (event) {
    if (event.keyCode === 13) {
        getSearchPrams();
    }
});

$("#mobileSearch").keydown(function (event) {
    if (event.keyCode === 13) {
        navtoLoc("index.html", {
            "search": true,
            "query": $("#mobileSearch").val(),
            "movies": true,
            "series": true,
            "genre": "0",
            "minRating": 0,
            "maxRating": 10
        })
    }
});

$(".movieButton").on('click', function () {
    navtoLoc("index.html", {
        "search": false
    })
})

window.setInterval(function () {
    k++;

    if (player.playing && k == 60) {
        k = 0
        if (type == "series") {
            data["series"][titleIndex]["ep_map"][cS]["episodes"][cE]["progress"] = 100 * (player.currentTime / player.duration)
            update = {
                "type": "series",
                "titleIndex": titleIndex,
                "cS": cS,
                "cE": cE,
                "progress": 100 * (player.currentTime / player.duration)
            }
            $.post(JSONServer + "/update", update, function (response) {
                return
            })
        } else if (j % 2 == 0) {
            data["movies"][titleIndex]["progress"] = 100 * (player.currentTime / player.duration)
            update = {
                "type": "movies",
                "titleIndex": titleIndex,
                "progress": 100 * (player.currentTime / player.duration)
            }
            $.post(JSONServer + "/update", update, function (response) {
                return
            })
        }
    }

    if (player.ended && type == "series") {
        playnext = false

        if (cE + 1 < data[type][titleIndex]["ep_map"][cS]["episodes"].length) {
            cE++;
            playnext = true;
        }

        else if (cS + 1 < data[type][titleIndex]["ep_map"].length) {
            cE = 0;
            cS++;
            playnext = true
        }

        if (playnext) {
            $(".episode").removeClass("activeEpisode")
            $($("#seriesCont").get(0)).find(".episode[data-sindex=" + cS + "][data-eindex=" + cE + "]").addClass("activeEpisode")

            ratingBar.title = data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["title"]

            data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["progress"] = 0

            player.source = {
                type: 'video',
                title: data[type][titleIndex]["title"],
                sources: [{
                    src: header + data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["id"],
                    type: 'video/mp4'
                }]
            }
        }



    }
}, 500);