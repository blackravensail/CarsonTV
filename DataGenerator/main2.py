import json
import os
import requests
from PIL import Image
from imdbpie import Imdb
import ipfsapi as ipfs
import glob
import cv2

imdb = Imdb()

api = ipfs.connect('127.0.0.1', 5001)

dir = "E:\\CarsonMedia"

data = {"movies": [],
        "series": []}
'''
for name in os.listdir(os.path.join(dir, 'Movies')):
    print ("Starting: " + name)

    path = os.path.join(os.path.join(dir, 'Movies'),name)

    if os.path.exists(os.path.join(path, "info.json")):
        tempData = json.loads(open(os.path.join(path, "info.json")).read())
    else:
        tempData = {"imdb_id":"",
                    "title":"",
                    "description":"",
                    'rating':"",
                    'duration':"",
                    "release_date":"",
                    "genres":[],
                    "main_id":"",
                    "trailer_id":"",
                    "tall":"",
                    "wide":""}
    if "" in tempData.values() or [] in tempData.values():
        try:
            if tempData["imdb_id"] == "":
                imdb_id = imdb.search_for_title(name)[0]["imdb_id"]
                movie = imdb.get_title(imdb_id)
                if input( movie["base"]["title"] +" == "+ name) == "n" :
                    imdb_id = input("Enter id:")
                    movie = imdb.get_title(imdb_id)
                tempData["imdb_id"] = imdb_id
            else:
                movie = imdb.get_title(tempData["imdb_id"])
        except:
            print("something Failed")
            imdb_id = imdb.search_for_title(name)[0]["imdb_id"]
            movie = imdb.get_title(imdb_id)
            if input( movie["base"]["title"] +" == "+ name) == "n" :
                imdb_id = input("Enter id:")
                movie = imdb.get_title(imdb_id)
            tempData["imdb_id"] = imdb_id

        try:
            if tempData['title'] == "":
                tempData['title'] = movie["ratings"]["title"]
        except:
            print ("Couldn't get title")
        try:
            if tempData["description"] == "":
                tempData["description"] = movie['plot']['outline']['text']
        except:
            print ("Couldn't get description")
        try:
            if tempData['rating'] == "":
                tempData['rating'] = movie["ratings"]['rating']
        except:
            print ("Couldn't get ratings")
        try:
            if tempData['duration'] == "":
                tempData['duration'] = movie['base']["runningTimeInMinutes"]
        except:
            print ("Couldn't get duration")
        try:
            if tempData["release_date"] == "":
                tempData["release_date"] = movie["base"]['year']
        except:
            print ("Couldn't get release date")
        try:
            if tempData["genres"] == []:
                tempData["genres"] = imdb.get_title_genres(tempData["imdb_id"])["genres"]
        except:
            print ("Couldn't get geners")

        #Add main video file
        if tempData["main_id"] == "":
            print("Adding File to IPFS")
            tempData["main_id"] = api.add(os.path.join(path, glob.glob(os.path.join(path,'*.mp4'))[0]), only_hash=True)["Hash"]

        #Add trailer file, download if doesn't exist
        if tempData["trailer_id"] == "":
            if (len(glob.glob(os.path.join(path,'*.trailer'))) == 0):
                print("No trailer found. Downloading.")
                url = imdb.get_title_videos(tempData["imdb_id"])['videos'][0]["encodings"][0]["play"]
                r = requests.get(url)
                open(os.path.join(path, tempData['title']+".trailer"),'wb').write(r.content)
            tempData["trailer_id"] = api.add(os.path.join(path, glob.glob(os.path.join(path,'*.trailer'))[0]), only_hash=True)["Hash"]
            print ("Got a trailer")
        if tempData["tall"] == "":
            #Add tall image, download if necessary
            if len(glob.glob(os.path.join(path,'tall.*'))) == 0:
                print ("No tall image found. Downloading.")
                url = movie['base']["image"]['url']
                r = requests.get(url)
                open(os.path.join(path, "tall.jpg"),'wb').write(r.content)
            tempData["tall"] = api.add(os.path.join(path, glob.glob(os.path.join(path,'tall.*'))[0]), only_hash=True)["Hash"]
        if tempData["wide"] == "":
            tempData["wide"] = api.add(os.path.join(path, glob.glob(os.path.join(path,'wide.*'))[0]), only_hash=True)["Hash"]

        with open(os.path.join(path, "info.json"),'w') as file:
            json.dump(tempData, file)

    data["movies"].append(tempData)



'''
#-----------------------------------------------------------------





for name in os.listdir(os.path.join(dir, 'Series')):
    path = os.path.join(os.path.join(dir, 'Series'), name)
    print("Starting: " + name)

    if os.path.exists(os.path.join(path, "info.json")):
        tempData = json.loads(open(os.path.join(path, "info.json")).read())
        otempData = tempData
    else:
        tempData = {"title":"",
                    "rating":"",
                    "description":"",
                    "release_date":"",
                    "genres":[],
                    "imdb_id":"",
                    "tall":"",
                    "wide":"",
                    "cS":0,
                    "cE":0,
                    "ep_map":[]}
    if "" in tempData.values():
        try:
            if tempData["imdb_id"] == "":
                imdb_id = imdb.search_for_title(name)[0]["imdb_id"]
                show = imdb.get_title(imdb_id)
                tempData["imdb_id"] = imdb_id
            else:
                show = imdb.get_title(tempData["imdb_id"])
        except:
            imdb_id = imdb.search_for_title(name)[0]["imdb_id"]
            show = imdb.get_title(imdb_id)
            tempData["imdb_id"] = imdb_id

        if tempData['title'] == "":
            tempData['title'] = show["base"]["title"]
        if tempData['rating'] == "":
            tempData['rating'] = show["ratings"]['rating']
        if tempData["description"] == "":
            tempData["description"] = show['plot']['outline']['text']
        if tempData["release_date"] == "":
            tempData["release_date"] = show["base"]['year']
        if tempData["genres"] == []:
            tempData["genres"] = imdb.get_title_genres(imdb_id)["genres"]
        if tempData["tall"] == "":
            tempData["tall"] = api.add(os.path.join(path, glob.glob(os.path.join(path,'tall.*'))[0]))["Hash"]
        if tempData["wide"] == "":
            tempData["wide"] = api.add(os.path.join(path, glob.glob(os.path.join(path,'wide.*'))[0]))["Hash"]

    tempData["ep_map"] == []
    for seasonName in os.listdir(os.path.join(path, "seasons")):
        seasonPath = os.path.join(os.path.join(path, "seasons"), seasonName)
        print("--Starting: " + seasonName)
        sO = {"title": seasonName,
                "episodes":[]}
        for episodeName in os.listdir(seasonPath):
            episodePath = os.path.join(seasonPath, episodeName)
            print("----Starting: "+episodeName)
            if not os.path.exists(os.path.join(episodePath, "info.json")):
                if len(glob.glob(os.path.join(episodePath,'tall*'))) == 0:
                    cap = cv2.VideoCapture(os.path.join(episodePath, glob.glob(os.path.join(episodePath,'*.mp4'))[0]))
                    for i in range(6000):
                        ret, frame = cap.read()
                    cv2.imwrite(os.path.join(episodePath, "tall.jpg"), frame)

                if name == "Mister Rogers Neighborhood":
                    tname = episodeName
                else:
                    tname = episodeName[5:]
                td = {
                    "title": tname,
                    "id" : api.add(os.path.join(episodePath, glob.glob(os.path.join(episodePath,'*.mp4'))[0]), only_hash=True)["Hash"],
                    "tall" : api.add(os.path.join(episodePath, glob.glob(os.path.join(episodePath,'tall*'))[0]))["Hash"],
                    "progress":0
                }
                with open(os.path.join(episodePath, "info.json"),'w') as file:
                    json.dump(td, file)
            else:
                td = json.loads(open(os.path.join(episodePath, "info.json")).read())

            sO["episodes"].append(td)
        print(tempData)
        tempData["ep_map"].append(sO)

    try:
        if otempData != tempData:
            with open(os.path.join(path, "info.json"),'w') as file:
                json.dump(tempData, file)
    except:
        with open(os.path.join(path, "info.json"),'w') as file:
            json.dump(tempData, file)

    data["series"].append(tempData)
    break

with open("fileDump.json",'w') as file:
    json.dump(data, file)
with open("dataDump.js",'w') as file:
    file.write("data = ")
    file.write(open("fileDump.json").read())
