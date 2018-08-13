var slider;
var titleCont;

var firstLoad = false
var userID

console.log("Version 83")

if (Cookies.get("UserID") == undefined) {
    $("#exampleModal").modal('show');
    userID = 'test'
    firstLoad = true
}
else {
    userID = Cookies.get("UserID")
}


JSONServer = "http://76.114.138.132:8081"

$.ajax({
    dataType: "json",
    url: JSONServer + "/json",
    crossDomain: true,
    data:{"UserID":userID},
    success: function(json) {
        $(document).ready(function () {
            main(json["titles"], json["pdata"]);
        })
    }
  });





function main(data, personal) {

    if (firstLoad) {
        var sliderID = "tt0327137"
    }
    else {
        var sliderID = Object.keys(data)[Math.floor((new Date()).getTime() / 100000) % Object.keys(data).length]
        $("#idBox").text(userID)
    }

    slider = new Vue({
        el: "#vue_slider",
        data: {
            title: data[sliderID],
            id: sliderID
        },
        methods: {
            getBackgroundStyle: function () {
                return ("background-image:url('" + this.title["location"] + "/" + this.title["wide"] + "') !important;")
            },
            getType: function () {
                if (this.title["type"] == "movie") {
                    return "Film"
                }
                else if (this.title["type"] == "series") {
                    return "TV Show"
                }
                else {
                    return "Unknown"
                }
            },
            getColor: function (rating) {
                if (rating > 6) {
                    return "green"
                }
                return "red"
            },
            getAddress: function () {
                return "view.html?id=" + this.id
            }
        }
    })

    titleCont = new Vue({
        el: "#pannelCont",
        data: {
            set: new Set(["1","2","3","4"]),
            titles: data,
            header: "TV Shows",
            type:"series",
            pdata: personal
        },
        methods: {
            addheader: function (str) {
                return header + str
            },
            getColor: function (rating) {
                if (rating > 6) {
                    return "green"
                }
                return "red"
            },
            returnProgress: function(id){
                if (this.pdata.hasOwnProperty(id)) {
                    if (this.pdata[id].hasOwnProperty("progress")) {
                        console.log(this.pdata[id]["progress"])
                        return this.pdata[id]["progress"]
                    }
                }
                return 0
            }
        }
    })

    $(".men_item").on('click', function () {
        $(".men_item").removeClass("current-menu-item")
        $(this).addClass("current-menu-item")
        if ($(this).find("a").text().replace(/\s/g, '') == "Movies") {
            titleCont.type = "movie"
            titleCont.header = "Films"
        } else {
            titleCont.type = "series"
            titleCont.header = "TV Shows"
        }
        $(window).scrollTo($(".dashboard-genres-pro"), 800)

    })

    $(".genre_button").on("click", function () {
        $(".genre_button").removeClass("active")
        $(this).addClass("active")
        var genre = $(this).find("h6").text().replace(/\s/g, '')
        var set = new Set()
        for (var key in data) {
            if (data.hasOwnProperty(key) && data[key]["genres"].indexOf(genre) >= 0) {
                set.add(key)
            }
        }
        titleCont.type = null
        titleCont.header = genre
        titleCont.set = set
        $(window).scrollTo($(".dashboard-genres-pro"), 800)

    })

    $("#searchButton").on("click", function () {
        getSearchPrams()
    })
    $("#searchBar").keyup(function (event) {
        if (event.keyCode === 13) {
            getSearchPrams();
        }
    });

    $("#mobileSearch").keyup(function (event) {
        if (event.keyCode === 13) {
            search($("#mobileSearch").val(), true, true, "0", 0, 10)
        }
    });
    console.log(url.searchParams.get("search"), url.searchParams.get("men"))
    if (url.searchParams.get("search") == "false") {
        
        if (url.searchParams.get("men") == "movies") {
            $(".men_item").removeClass("current-menu-item")
            $(".movie_menu_item").addClass("current-menu-item")
            console.log("changing to Movies")
            titleCont.type = "movie"
            titleCont.header = "Films"
        }
        $(window).scrollTo($(".dashboard-genres-pro"), 800)
}


}

$(".fa-cogs").on('click', function () {
    console.log("tried to open modal")
    $("#exampleModal").modal('show');
})

$("#saveChange").on('click', function () {
    Cookies.set("UserID", $("#userIDForm").val())
    location.reload()
})


function search(query, movies, series, genre, minRating, maxRating) {
    list = []
    for (var id in data){
        if (data.hasOwnProperty(id)) {
            if ((data[id]["type"] == "movie" && movies) || (data[id]["series"] == "series" && series)){
                if (data[id]["rating"] > minRating && data[id]["rating"] < maxRating) {
                    if (genre == "0") {
                        list.push(id)
                    } else if (data[id]['genres'].indexOf(genre) >= 0) {
                        list.push(id)
                    }
                }
            }
        }
    }

    //rank by number of occurances of each individual word
    var obj = {}
    var nquery = query.toLowerCase()
    nquery = nquery.replace(",", "")
    nquery = nquery.replace(" the ", " ")
    nquery = nquery.replace(" of ", " ")
    nquery = nquery.replace(" and ", " ")
    nquery = nquery.replace(" a ", " ")
    nquery = nquery.replace(" to ", " ")
    nquery = nquery.replace(" on ", " ")
    nquery = nquery.replace("the ", "")

    var querylist = nquery.split(' ')

    for (i = 0; i < list.length; i++) {
        rank = 0
        main = data[list[i]]
        for (j = 0; j < querylist.length; j++) {
            rank += count(main["title"].toLowerCase(), querylist[j])
            rank += count(main["description"].toLowerCase(), querylist[j])
        }
        obj[i] = {
            "id": list[i],
            "rank": rank
        }

    }
    //convert list
    nlist = []
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key].rank == 0) {
                delete obj[key]
            } else {
                nlist.push(obj[key])
            }

        }
    }

    //sort by rank
    nlist.sort(compare)
    nset = new Set()
    for (var i = 0; i < nlist.length; i++) {
        nset.add(nlist[i]["id"])
    }
    //display
    titleCont.type = null
    titleCont.header = query
    titleCont.set = set
    var url = new URL(window.location.href)
    $(window).scrollTo($("#pannelCont"), 800)

}

function compare(a, b) {
    if (a.rank < b.rank)
        return 1;
    if (a.rank > b.rank)
        return -1;
    return 0;
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
    if (genre == "All Genres") {
        genre = "0"
    }
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
    search($("#searchBar").val(), $("#movies-type").attr("checked") == "checked", $("#tv-type").attr("checked") == "checked", genre, minR, maxR)
}



var url = new URL(window.location.href)
if (url.searchParams.get("search") == "true") {
    //query, movies, series, genre, minRating, maxRating
    var queryt = url.searchParams.get("query")

    var moviest = (url.searchParams.get("movies") == "true")
    var seriest = (url.searchParams.get("series") == "true")

    var genret = url.searchParams.get("genre")

    var minRatingt = parseInt(url.searchParams.get("minRating"))
    var maxRatingt = parseInt(url.searchParams.get("maxRating"))
    search(queryt, moviest, seriest, genret, minRatingt, maxRatingt)
}
