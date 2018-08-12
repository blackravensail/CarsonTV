var url = new URL(window.location.href)
var id = url.searchParams.get("id")

var j = 0
var k = 0

JSONServer = "http://blakewintermute.pythonanywhere.com"

var playnext
var played = false

var sidebar
var ratingBar
var desBox
var epBox
var player

var data
var pdata
var serverList
var timeCounter = 0;
var canPlayRan = false

var cS
var cE

if (Cookies.get("UserID") == undefined) {
    window.location = "/"
}
else {
    userID = Cookies.get("UserID")
}


$.ajax({
    dataType: "json",
    url: JSONServer + "/json",
    crossDomain: true,
    data: { "UserID": userID },
    success: function (json) {
        $(document).ready(function () {
            data = json["titles"]
            pdata = json["pdata"]
            main();
        })
    }
});




function main() {

    defineVueElm()

    player = new Plyr("#main_video", {
        ratio: "16:9"
    })


    // Set Time to current time saved
    player.on('canplaythrough', event => {
        if (!canPlayRan) {
            canPlayRan = true
            if (pdata.hasOwnProperty(id)) {
                console.log("settime")
                if (data[id]["type"] == "series") {
                    setTimeout(function () { player.currentTime = ((pdata[id]["map"][cS.toString()][cE.toString()] / 100.0) * player.duration); }, 600);

                }
                else if (j % 2 == 0) {
                    setTimeout(function () { player.currentTime = ((pdata[id] / 100) * player.duration); }, 600);

                }
            }
        }
    });

    //Update tracking server
    player.on('timeupdate', event => {
        timeCounter++;
        if (timeCounter >= 20) {
            timeCounter = 0
            if (player.currentTime == 0) {
                return
            }
            played = true
            console.log("Updating Server Time")
            if (data[id]["type"] == "series") {
                if (!pdata.hasOwnProperty(id)) {
                    pdata[id] = {
                        "cS": cS,
                        "cE": cE,
                        "map": {}
                    }
                }

                if (!pdata[id]["map"].hasOwnProperty(cS.toString())) {
                    pdata[id]["map"][cS.toString()] = {}
                }

                pdata[id]["map"][cS.toString()][cE.toString()] = 100 * (player.currentTime / player.duration)
                update = {
                    "UserID": userID,
                    "id": id,
                    "cS": cS,
                    "cE": cE,
                    "progress": 100 * (player.currentTime / player.duration)
                }

                $.ajax({
                    dataType: "json",
                    url: JSONServer + "/update",
                    method: "POST",
                    crossDomain: true,
                    data: JSON.stringify(update)
                })
            }
            else if (j % 2 == 0) {
                pdata[id] = 100 * (player.currentTime / player.duration)
                update = {
                    "UserID": userID,
                    "id": id,
                    "progress": 100 * (player.currentTime / player.duration)
                }
                $.ajax({
                    dataType: "json",
                    url: JSONServer + "/update",
                    method: "POST",
                    crossDomain: true,
                    data: JSON.stringify(update)
                })
            }
        }
    })

    //Play next Episode Automagically
    player.on('ended', event => {
        console.log("ended")
        if (played) {
            if (data[id]["type"] == "series") {
                var playNext = false
                var season = cS
                var episode = cE
                if (cE + 1 < data[id]["ep_map"][cS]["episodes"].length) {
                    episode++;
                    playNext = true;
                }
                else if (cS + 1 < data[id]["ep_map"].length) {
                    episode = 0;
                    season++;
                    playNext = true
                }

                if (playNext) {
                    console.log(season, episode)
                    playEpisode(season, episode)
                }
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
            swipeToSlide: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 2,
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
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


            playEpisode(season, episode)

            $(window).scrollTo({
                left: 0,
                top: 0
            }, 800)
        })
    }
    else {
        $("#seriesCont").hide()

        srcObj = {
            type: 'video',
            title: data[id]["title"],
            sources: [{
                src: data[id]["location"] + "/" + data[id]["feature"],
                type: 'video/mp4'
            }]
        }

        if (data[id].hasOwnProperty("captions")) {
            srcObj["tracks"] = data[id]["captions"]
        }


        player.source = srcObj

        $("#trailer_Button").on("click", function () {
            canPlayRan = false
            if (j % 2 == 0) {
                player.source = {
                    type: 'video',
                    title: data[id]["title"],
                    sources: [{
                        src: "http://ipfs.io/ipfs/" + data[id]["location"]["ipfs"] + "/" + data[id]["trailer"],
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

    console.log(season, episode)

    ratingBar.title = data[id]["ep_map"][season]["episodes"][episode]
    try {
        if (data[id]["ep_map"][season]["episodes"][episode].hasOwnProperty("description") && data[id]["ep_map"][season]["episodes"][episode]["description"] != "") {
            desBox.description = data[id]["ep_map"][season]["episodes"][episode]["description"]
        }
    }
    catch (err) { }

    played = false

    $(".activeEpisode").removeClass("activeEpisode")
    $($("#seriesCont").get(0)).find(".episode[data-sindex=" + season + "][data-eindex=" + episode + "]").addClass("activeEpisode")

    srcObj = {
        type: 'video',
        title: data[id]["title"],
        sources: [{
            src: data[id]["location"] + "/" + data[id]["ep_map"][season]["episodes"][episode]["video"],
            type: 'video/mp4'
        }]
    }

    if (data[id]["ep_map"][season]["episodes"][episode].hasOwnProperty("captions")) {
        srcObj["tracks"] = data[id]["ep_map"][season]["episodes"][episode]["captions"]
    }

    player.source = srcObj
    canPlayRan = false

    cE = episode
    cS = season

    window.cE = cE

}

function defineVueElm() {
    console.log(data)
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
                header: data[id]["location"] + "/",
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
