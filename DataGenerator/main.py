import json
import os
import requests
from PIL import Image
from StringIO import StringIO
from requests.exceptions import ConnectionError
from imdbpie import Imdb
import ipfsapi as ipfs

imdb = Imdb()

api = ipfs.connect('127.0.0.1', 5001)

def getWideImage(query):
    """Download full size images from Google image search.
    Don't print or republish images without permission.
    I used this to train a learning algorithm.
    """
    BASE_URL = 'https://ajax.googleapis.com/ajax/services/search/images?'\
             'v=1.0&q=' + query + '&start=%d'

    start = 8 # Google's start query string parameter for pagination. # Google will only return a max of 56 results.
    print BASE_URL % start
    r = requests.get(BASE_URL % start)
    print json.loads(r.text)
    for image_info in json.loads(r.text)['responseData']['results']:
        url = image_info['unescapedUrl']
        try:
            image_r = requests.get(url)
            img  = Image.open(StringIO(image_r.content))
            width, height = img.size
            if abs(width/height - 1.77) < .2 and width > 1000:
                return(img)
        except ConnectionError, e:
            print('could not download %s' % url)
        continue

dir = "CarsonMedia"

data = {"movies": [],
        "series": []}

for name in os.listdir(os.path.join(dir, 'Movies')):
    print "Starting " + name

    path = os.path.join(os.path.join(dir, 'Movies'),name)
    if not os.path.exists(os.path.join(path, "info.json")):
        print("No data found for " + name + ". Lets Go Digging!" )

        tempData = {}
        imdb_id = imdb.search_for_title(name)[0]["imdb_id"]
        movie = imdb.get_title(imdb_id)
        print("Found Movie")

        tempData['title'] = movie["ratings"]["title"]
        tempData["description"] = movie['plot']['outline']['text']
        tempData['rating'] = movie["ratings"]['rating']
        tempData['duration'] = movie['base']["runningTimeInMinutes"]
        tempData["release_date"] = movie["base"]['year']
        tempData["genres"] = imdb.get_title_genres(imdb_id)["genres"]
        print "Got all the Boring stuff"

        #Add main video file
        tempData["main_id"] = api.add(os.path.join(path, "main.mp4"))["Hash"]

        #Add trailer file, download if doesn't exist
        if not os.path.exists(os.path.join(path, "trailer.mp4")):
            print "No trailer found. Downloading."
            url = imdb.get_title_videos(imdb_id)['videos'][0]["encodings"][0]["play"]
            r = requests.get(url)
            open(os.path.join(path,"trailer.mp4"),'wb').write(r.content)
        tempData["trailer_id"] = api.add(os.path.join(path, "trailer.mp4"))["Hash"]
        print "Got a trailer"

        #Add tall image, download if necessary
        if not os.path.exists(os.path.join(path, "tall.jpg")):
            print "No tall image found. Downloading."
            url = movie['base']["image"]['url']
            r = requests.get(url)
            open(os.path.join(path,"tall.jpg"),'wb').write(r.content)
        tempData["tall"] = api.add(os.path.join(path, "tall.jpg"))["Hash"]

        #Add wide image, downlaod if necessary
        if not os.path.exists(os.path.join(path, "wide.jpg")):
            print "No wide image found. Downloading."
            img = getWideImage(tempData['title'])
            img.save(os.path.join(path, "wide.jpg"))
        tempData["wide"] = api.add(os.path.join(path, "wide.jpg"))["Hash"]

        with open(os.path.join(path, "info.json"),'w') as file:
            json.dump(tempData, file)

        #Add tempData to data
        data["movies"].append(tempData)
    else:
        print("Found Data For " + name)
        data["movies"].append(json.loads(open(os.path.join(path, "info.json")).read()))




for name in os.listdir(os.path.join(dir, 'Series')):
    path = os.path.join(os.path.join(dir, 'Series'), name)
    print("Starting " + name)
    if not os.path.exists(os.path.join(path, "info.json")):
        print("No data found for " + name + ". Lets Go Digging!" )
        tempData = {}
        imdb_id = imdb.search_for_title(name)[0]["imdb_id"]
        show = imdb.get_title(imdb_id)

        tempData['title'] = show["base"]["title"]
        tempData['rating'] = show["ratings"]['rating']
        tempData["description"] = show['plot']['outline']['text']
        tempData["release_date"] = show["base"]['year']
        tempData["genres"] = imdb.get_title_genres(imdb_id)["genres"]

        tempData["trailer_id"] = api.add(os.path.join(path, "trailer.mp4"))["Hash"]
        tempData["tall"] = api.add(os.path.join(path, "tall.jpg"))["Hash"]
        tempData["wide"] = api.add(os.path.join(path, "wide.jpg"))["Hash"]

        print("Done Boring Stuff, Saving to File")

        with open(os.path.join(path, "info.json"),'w') as file:
            json.dump(tempData, file)
    else:
        print("Found Data, for "+name+" , loading and saving!")
        tempData = json.loads(open(os.path.join(path, "info.json")).read())

    tempData["ep_map"] = {}

    for seasonName in os.listdir(path):
        seasonPath = os.path.join(path, seasonName)
        if os.path.isdir(seasonPath):
            tempData['ep_map'][seasonName] = []
            for episodeName in os.listdir(seasonPath):
                episodePath = os.path.join(seasonPath, episodeName)
                if os.path.isdir(episodePath):
                    if not os.path.exists(os.path.join(episodePath, "info.json")):
                        print("No data found for: " + episodeName + " Lets make some!" )
                        td = {
                            "title": episodeName,
                            "id" : api.add(os.path.join(episodePath, "main.mp4"))["Hash"],
                            "tall" : api.add(os.path.join(episodePath, "tall.jpg"))["Hash"]
                        }
                        with open(os.path.join(episodePath, "info.json"),'w') as file:
                            json.dump(td, file)
                    else:
                        print("Found Data for: " + episodeName + "Load and Save!")
                        td = json.loads(open(os.path.join(episodePath, "info.json")).read())
                    tempData['ep_map'][seasonName].append(td)
    data["series"].append(tempData)

with open("fileDump.json",'w') as file:
    json.dump(data, file)
