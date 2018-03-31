$(window).on("load", function() {
    $(".button-collapse").sideNav();
    plyr.setup();
    $('select').material_select();
    renderTitles()
})

function renderTitles() {
    for (var title in titles) {
        if (titles.hasOwnProperty(title)) {
            if (titles[title]["type"] == "movie") {
                $('#titleHolder').append($("<div class='chip title' id='" + titles[title]["id"] + "'><img src='https://ipfs.io/ipfs/" + videos[titles[title]["id"]]["coverArt"] + "'>" + title + "</div>"));
            } else {
                $('#titleHolder').append($("<div class='chip title' id='show'><img src='https://ipfs.io/ipfs/" + titles[title]["coverArt"] + "'>" + title + "</div>"));
            }
        }
    }
    $(".title").on("click", function() {
        if ($(this).attr("id") !== "show") {
            setVideoSrc($(this).attr("id"));
        } else {
            var name = $(this).html();
            name = name.replace(/<.+\>/, '')
            var epMap = titles[name]["epMap"];
            var seasons = titles[name]["Seasons"]
            console.log(name);
            $('#input-field').html("");
            $('#input-field').append($("<select id='ep-selector'></select>"));
            for (var i = 0; i < seasons.length; i++) {
                var sea = seasons[i];
                $('#ep-selector').append($("<option value='" + sea + "'>" + sea + "</option>"));

            }
            $('#ep-selector').material_select();
            renderEps(name, seasons[0])
            $('#ep-selector').on('change', function() {
                renderEps(name, seasons[$('#ep-selector')[0]['selectedIndex']])
            })
        }
    })
}

function setVideoSrc(source) {
    $('#vid-cont').html("")
    console.log(source)
    var vid = $("<video controls><source src='https://ipfs.io/ipfs/" + source + "' type='video/mp4'>Your browser doesn't support HTML5 video</video>")
    $('#vid-cont').append(vid);
    plyr.setup();
    $("#info").html("")
    $("#info").append("<h3>"+ videos[source]["title"] +"</h3>");
    $("#info").append("<h5>"+ videos[source]["duration"] +"</h5>");
    $("#info").append("<p>"+ videos[source]["description"] +"</p>");
    $
}

function renderEps(title, season) {
    console.log(title);
    console.log(season);
    var ep_list = titles[title]["epMap"][season]
    console.log(ep_list)
    $('#ep-box').html("");
    for (var i = 0; i < ep_list.length; i++) {
        ep = ep_list[i]
        console.log(ep);
        $('#ep-box').append($("<div class='chip episode' id='" + ep + "'><img src='https://ipfs.io/ipfs/" + videos[ep]["coverArt"] + "'>" + videos[ep]["title"] + "</div>"))
    }
    $('.episode').on('click', function() {
        setVideoSrc(this.id);
    })

}
