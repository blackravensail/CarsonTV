var url = new URL(window.location.href)
var id = url.searchParams.get("id")
var main_obj

var header = ""
var sidebar
var main_area

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
                    header:header
                },
                methods : {
                    getColor: function(rating, bool) {
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
                    }
                }
            })
        }
    }

})
