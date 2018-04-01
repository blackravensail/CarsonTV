var url = new URL(window.location.href)
var id = url.searchParams.get("id")
var main_obj
var j = 0

var header = ""
var sidebar
var main_area
var player

$("#seriesCont").hide()

$.getJSON("./DataGenerator/fileDump.json", function(json) {
    data = json
    var tl = data["series"]
    tl = tl.concat(data["movies"])
    for (var i = 0; i < tl.length; i++) {
        if (tl[i]["title"] == id) {
            main_obj = tl[i];
            sidebar = new Vue({
                el:"#content-sidebar-pro",
                data:{
                    title:main_obj,
                    header:header
                }
            })
            main_area = new Vue({
                el:"#col-main-with-sidebar",
                data:{
                    title:main_obj,
                    epMap:main_obj["ep_map"],
                    currentSeasonName: "",
                    currentSeason: [],
                    header:header
                },
                methods : {
                    getColor: function(rating) {
                        if (rating > 7){return "green"}
                        if (rating > 5){return "orange"}
                        return "red"
                    },
                    changeVideo: function(id) {
                        console.log("HIIII")
                        console.log(id)
                        player.source ={
                            type:'video',
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
    player = new Plyr("#main_video")
    window.rr = player


    if (main_obj.hasOwnProperty("ep_map")){
        renderSeasons(main_obj["ep_map"])
        player.source ={
            type:'video',
            title: main_obj["title"],
            sources: [{
                src: header + main_obj["trailer_id"],
                type: 'video/mp4'
            }]
        }
        $("#trailer_Button").hide()
    }
    else {
        player.source ={
            type:'video',
            title: main_obj["title"],
            sources: [{
                src: header + main_obj["main_id"],
                type: 'video/mp4'
            }]
        }
    }
    player.poster = header + main_obj["wide"]
    player.ratio = "16:9"

    $("#trailer_Button").on("click", function() {
        if( j%2 == 0){
            player.source ={
                type:'video',
                title: main_obj["title"],
                sources: [{
                    src: header + main_obj["trailer_id"],
                    type: 'video/mp4'
                }]
            }
            $("#trailer_Button").html("<i class='fas fa-play'></i>Watch Film")
        }
        else{
            player.source ={
                type:'video',
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
    player.source ={
        type:'video',
        title: "",
        sources: [{
            src: header + id,
            type: 'video/mp4'
        }]
    }
}
