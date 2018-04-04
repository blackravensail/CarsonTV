import json
import os
import requests
from PIL import Image
from imdbpie import Imdb
import ipfsapi as ipfs
import glob

imdb = Imdb()

api = ipfs.connect('127.0.0.1', 5001)

dir = "E:\\CarsonMedia"

data = {"movies": [],
        "series": []}

for name in os.listdir(os.path.join(dir, 'Movies')):
    print ("Starting " + name)

    path = os.path.join(os.path.join(dir, 'Movies'),name)
    if not os.path.exists(os.path.join(path, "info.json")):
        print("No data found for " + name + ". Lets Go Digging!" )

        tempData = {}
        imdb_id = imdb.search_for_title(name)[0]["imdb_id"]
        movie = imdb.get_title(imdb_id)
        print("Found Movie")
        try:
            tempData['title'] = movie["ratings"]["title"]
        except:
            pass
        try:
            tempData["description"] = movie['plot']['outline']['text']
        except:
            pass
        try:
            tempData['rating'] = movie["ratings"]['rating']
        except:
            pass
        try:
            tempData['duration'] = movie['base']["runningTimeInMinutes"]
        except:
            pass
        try:
            tempData["release_date"] = movie["base"]['year']
        except:
            pass
        try:
            tempData["genres"] = imdb.get_title_genres(imdb_id)["genres"]
        except:
            pass
        print("Got all the Boring stuff")

        #Add main video file
        print("Adding File to IPFS")
        tempData["main_id"] = api.add(os.path.join(path, glob.glob(os.path.join(path,'*.mp4'))[0]))["Hash"]

        #Add trailer file, download if doesn't exist
        if (len(glob.glob(os.path.join(path,'*.trailer'))) == 0):
            print("No trailer found. Downloading.")
            url = imdb.get_title_videos(imdb_id)['videos'][0]["encodings"][0]["play"]
            r = requests.get(url)
            open(os.path.join(path, tempData['title']+".trailer"),'wb').write(r.content)
        tempData["trailer_id"] = api.add(os.path.join(path, glob.glob(os.path.join(path,'*.trailer'))[0]))["Hash"]
        print ("Got a trailer")

        #Add tall image, download if necessary
        if len(glob.glob(os.path.join(path,'tall.*'))) == 0:
            print ("No tall image found. Downloading.")
            url = movie['base']["image"]['url']
            r = requests.get(url)
            open(os.path.join(path, "tall.jpg"),'wb').write(r.content)
        tempData["tall"] = api.add(os.path.join(path, glob.glob(os.path.join(path,'tall.*'))[0]))["Hash"]

        try:
            #Add wide image, downlaod if necessary
            if len(glob.glob(os.path.join(path,'wide.*'))) == 0:
                print ("No wide image found. Downloading.")
                img = getWideImage(tempData['title'])
                img.save(os.path.join(path, "wide.jpg"))
            tempData["wide"] = api.add(os.path.join(path, glob.glob(os.path.join(path,'wide.*'))[0]))["Hash"]
        except:
            pass

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

        tempData["trailer_id"] = api.add(os.path.join(path, glob.glob(os.path.join(path,'*.trailer'))[0]))["Hash"]
        tempData["tall"] = api.add(os.path.join(path, glob.glob(os.path.join(path,'tall.*'))[0]))["Hash"]
        tempData["wide"] = api.add(os.path.join(path, glob.glob(os.path.join(path,'wide.*'))[0]))["Hash"]

        print("Done Boring Stuff, Saving to File")

        tempData["ep_map"] = {}

        for seasonName in os.listdir(path):
            seasonPath = os.path.join(path, seasonName)
            if os.path.isdir(seasonPath):
                tempData['ep_map'][seasonName] = []
                for episodeName in os.listdir(seasonPath):
                    episodePath = os.path.join(seasonPath, episodeName)
                    if not os.path.exists(os.path.join(episodePath, "info.json")):
                        print("No data found for: " + episodeName + " Lets make some!" )
                        td = {
                            "title": episodeName,
                            "id" : api.add(os.path.join(episodePath, glob.glob(os.path.join(episodePath,'*.mp4'))[0]))["Hash"],
                            "tall" : api.add(os.path.join(episodePath, glob.glob(os.path.join(episodePath,'tall.*'))[0]))["Hash"]
                        }
                        with open(os.path.join(episodePath, "info.json"),'w') as file:
                            json.dump(td, file)
                    else:
                        print("Found Data for: " + episodeName + "Load and Save!")
                        td = json.loads(open(os.path.join(episodePath, "info.json")).read())
                    tempData['ep_map'][seasonName].append(td)
        with open(os.path.join(path, "info.json"),'w') as file:
            json.dump(tempData, file)
    else:
        print("Found Data, for "+name+" , loading and saving!")
        tempData = json.loads(open(os.path.join(path, "info.json")).read())
    data["series"].append(tempData)

with open("fileDump.json",'w') as file:
    json.dump(data, file)
