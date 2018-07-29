var url = new URL(window.location.href)
var id = url.searchParams.get("id")

var j = 0
var k = 0

JSONServer = "http://76.114.138.132:5000"

var playnext

var sidebar
var ratingBar
var desBox
var epBox
var player

var data
var pdata

var cS
var cE


/*
$.getJSON(JSONServer + "/json", function (json, status) {
    $(document).ready(function () {
         main(json["titles"], json["personal"]);
    })
})
*/

$(document).ready(function () {
    data = defaultData
    pdata = defaultPData
    main()
})


function main() {

    defineVueElm()

    player = new Plyr("#main_video", {
        ratio: "16:9"
    })


    // Set Time to current time saved
    player.on('canplay', event => {
        if (pdata.hasOwnProperty(id)) {
            if (data[id]["type"] == "series") {
                player.currentTime = ((pdata[id]["map"][cS.toString()][cE.toString()] / 100.0) * player.duration);
            }
            else if (j % 2 == 0) {
                player.currentTime = ((pdata[id] / 100) * player.duration);
            }
        }
    });

    //Update tracking server
    player.on('timechange', event => {
        if (data[id]["type"] == "series") {
            pdata[id]["map"][cS.toString()][cE.toString()] = 100 * (player.currentTime / player.duration)
            update = {
                "id": id,
                "cS": cS,
                "cE": cE,
                "progress": 100 * (player.currentTime / player.duration)
            }
            $.post(JSONServer + "/update", update, function (response) {
                return
            })
        }
        else if (j % 2 == 0) {
            pdata[id] = 100 * (player.currentTime / player.duration)
            update = {
                "id": id,
                "progress": 100 * (player.currentTime / player.duration)
            }
            $.post(JSONServer + "/update", update, function (response) {
                return
            })
        }
    })

    //Play next Episode Automagically
    player.on('ended', event => {
        if (data[id]["type"] == "series") {
            var playNext = false
            var season
            var episode
            if (cE + 1 < data[id]["ep_map"][cS]["episodes"].length) {
                episode = cE + 1;
                season = cS
                playNext = true;
            }
            else if (cS + 1 < data[id]["ep_map"].length) {
                episode = 0;
                season = cS + 1;
                playNext = true
            }

            if (playNext) {
                playEpisode(season, episode)
            }
        }

    })

    if (data[id]["type"] == "series") {
        $("#trailer_Button").hide()

        $('.seasonSlider').slick({
            slidesToShow: 4,
            slidesToScroll: 2,
            infinite: false,
            arrows: true,
            swipeToSlide: true
        });

        if (pdata.hasOwnProperty(id)) {
            cS = pdata[id]["cS"]
            cE = pdata[id]["cE"]
        }
        else {
            cS = 0
            cE = 0
        }

        playEpisode(cS, cE)

        $(".episode").on("click", function () {
            if ($(this).hasClass("activeEpisode")) {
                return;
            }

            console.log("Changing Episode")

            $(".episode").removeClass("activeEpisode")
            $(this).addClass("activeEpisode");


            season = $(this).attr('data-sindex')
            episode = $(this).attr('data-eindex')

            if (pdata.hasOwnProperty(id)) {
                if (pdata[id][map][season.toString()][episode.toString] > 95) {
                    pdata[id][map][season.toString()][episode.toString] = 0
                }
            }

            playEpisode(season, episode)

            $(window).scrollTo({
                left: 0,
                top: 0
            }, 800)
        })
    }
    else {
        $("#seriesCont").hide()

        var srcList = []
        for (var i; i < data[id]["location"]["html"].length; i++) {
            srcList.push({
                src: data[id]["location"]["html"][i] + "/" + data[id]["feature"],
                type: 'video/mp4'
            })
        }

        srcList.push({
            src: "http://ipfs.io/ipfs/" + data[id]["location"]["ipfs"] + "/" + data[id]["feature"],
            type: 'video/mp4'
        })

        srcObj = {
            type: 'video',
            title: data[id]["title"],
            sources: srcList
        }

        if (data[id].hasOwnProperty("captions")) {
            srcObj["tracks"] = data[id]["captions"]
        }


        player.source = srcObj

        $("#trailer_Button").on("click", function () {
            if (j % 2 == 0) {
                player.source = {
                    type: 'video',
                    title: data[id]["title"],
                    sources: [{
                        src: "http:ipfs.io/ipfs/" + data[id]["location"]["ipfs"] + "/" + data[id]["trailer_id"],
                        type: 'video/mp4'
                    }]
                }

                $("#trailer_Button").html("<i class='fas fa-play'></i>Watch Film")
            } else {
                player.source = srcObj

                $("#trailer_Button").html("<i class='fas fa-play'></i>Watch Trailer")
            }
            j++;
        })
    }
}

function playEpisode(season, episode) {
    ratingBar.title = data[id]["ep_map"][season]["episodes"][episode]

    $($("#seriesCont").get(0)).find(".episode[data-sindex=" + season + "][data-eindex=" + episode + "]").addClass("activeEpisode")

    var srcList = []
    for (var i = 0; i < data[id]["location"]["html"].length; i++) {
        srcList.push({
            src: data[id]["location"]["html"][i] + "/" + data[id]["ep_map"][season]["episodes"][episode]["video"],
            type: 'video/mp4'
        })
    }

    srcList.push({
        src: "http://ipfs.io/ipfs/" + data[id]["location"]["ipfs"] + "/" + data[id]["ep_map"][season]["episodes"][episode]["video"],
        type: 'video/mp4'
    })

    console.log(srcList)


    srcObj = {
        type: 'video',
        title: data[id]["title"],
        sources: srcList
    }

    if (data[id]["ep_map"][season]["episodes"][episode].hasOwnProperty("captions")) {
        srcObj["tracks"] = data[id]["ep_map"][season]["episodes"][episode]["captions"]
    }

    player.source = srcObj

    cE = episode
    cS = season

}

function defineVueElm() {
    sideBar = new Vue({
        el: "#content-sidebar-pro",
        data: {
            title: data[id]
        }
    })

    ratingBar = new Vue({
        el: "#ratingBar",
        data: {
            rating: data[id]["rating"],
            title: ""
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
            description: data[id]["description"]
        }
    })

    if (data[id]["type"] == "series") {
        epBox = new Vue({
            el: "#seriesCont",
            data: {
                ep_map: data[id]["ep_map"],
                header: "http://ipfs.io/ipfs/" + data[id]["location"]["ipfs"] + "/",
                pdata: pdata
            },
            methods: {
                getProgress: function (s, e) {
                    if (this.pdata.hasOwnProperty(id)) {
                        if (this.pdata[id]["map"].hasOwnProperty(s.toString()) && this.pdata["map"][s.toString()].hasOwnProperty(e.toString())) {
                            return this.padata[id]["map"][s.toString()][e.toString()]
                        }
                    }
                    return 0
                }
            }
        })
    }
}

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
