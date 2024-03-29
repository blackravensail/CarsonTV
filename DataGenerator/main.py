import json
import os
import requests
from PIL import Image
from imdbpie import Imdb
import glob
import cv2
import subprocess
import time

cwd = os.getcwd()
imdb = Imdb()

#----Variable Pointers ------------ Refer to README for how to
inputDirectory = "F:\\CarsonMedia"

header = "http://4.4.4.4:8081/"

ipfsCommand = "C:\\Users\\blake\\Documents\\ipfs.exe"  #unless you didn't add ipfs to path, you shouldn't need to change this

uDP = True

#-------------------------------


def getPointer(file):
    #------------------Edit where you pointers go to---------------
    #print(os.path.join(inputDirectory,file))
    #original = str(subprocess.check_output([ipfsCommand, "add", "--raw-leaves", "--only-hash", "--quiet", os.path.join(inputDirectory,file)], shell=True))
    #return(original[2:-3])
    path = file.replace("\\","/")
    return(path) #returns simple relative path: 'Movies/...'


os.chdir(inputDirectory)

data = {"movies": [],
        "series": [],
        "header": header}

for name in os.listdir('Movies'):
    print ("Starting: " + name)

    path = os.path.join('Movies',name)

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
                    "wide":"",
                    "progress":0}
    if "" in tempData.values() or [] in tempData.values() or "progress" not in tempData.keys() or uDP:
        try:
            if tempData["imdb_id"] == "":
                imdb_id = imdb.search_for_title(name)[0]["imdb_id"]
                print(imdb_id)
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

        tempData["progress"] = 0

        #Add main video file
        if tempData["main_id"] == "" or uDP:
            tempData["main_id"] = getPointer(glob.glob(os.path.join(path,'*.mp4'))[0])

        #Add trailer file, download if doesn't exist
        if tempData["trailer_id"] == "" or uDP:
            if (len(glob.glob(os.path.join(path,'*.trailer'))) == 0):
                print("No trailer found. Downloading.")
                url = imdb.get_title_videos(tempData["imdb_id"])['videos'][0]["encodings"][0]["play"]
                r = requests.get(url)
                open(os.path.join(path, tempData['title']+".trailer"),'wb').write(r.content)
            tempData["trailer_id"] = getPointer(glob.glob(os.path.join(path,'*.trailer'))[0])
        if tempData["tall"] == "" or uDP:
            #Add tall image, download if necessary
            if len(glob.glob(os.path.join(path,'tall.*'))) == 0:
                print ("No tall image found. Downloading.")
                url = movie['base']["image"]['url']
                r = requests.get(url)
                open(os.path.join(path, "tall.jpg"),'wb').write(r.content)
            tempData["tall"] = getPointer(glob.glob(os.path.join(path,'tall.*'))[0])
        if tempData["wide"] == "" or uDP:
            if len(glob.glob(os.path.join(path,'wide*'))) == 0:
                cap = cv2.VideoCapture(os.path.join(path, glob.glob(os.path.join(episodePath,'*.mp4'))[0]))
                for i in range(10000):
                    ret, frame = cap.read()
                cv2.imwrite(os.path.join(episodePath, "wide.jpg"), frame)
            tempData["wide"] = getPointer(glob.glob(os.path.join(path,'wide.*'))[0])
        if not uDP:
            with open(os.path.join(path, "info.json"),'w') as file:
                json.dump(tempData, file)

    data["movies"].append(tempData)



#-----------------------------------------------------------------



for name in os.listdir('Series'):
    path = os.path.join('Series', name)
    print("Starting: " + name)

    if os.path.exists(os.path.join(path, "info.json")):
        tempData = json.loads(open(os.path.join(path, "info.json")).read())

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
                    "ep_map":[],
                    "progress": 0}
    otempData = tempData
    if "" in tempData.values() or "progress" not in tempData.keys() or uDP:
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
        if tempData["tall"] == "" or uDP:
            print("No data for tall found")
            if len(glob.glob(os.path.join(path,'tall.*'))) == 0:
                print ("No tall image found. Downloading.")
                url = show['base']["image"]['url']
                r = requests.get(url)
                open(os.path.join(path, "tall.jpg"),'wb').write(r.content)
            tempData["tall"] = getPointer(glob.glob(os.path.join(path,'tall.*'))[0])
        if tempData["wide"] == "" or uDP:
            tempData["wide"] = getPointer(glob.glob(os.path.join(path,'wide.*'))[0])
        tempData["progress"] = 0
        if not uDP:
            with open(os.path.join(path, "info.json"),'w') as file:
                json.dump(tempData, file)


    tempData["ep_map"] = []

    for seasonName in os.listdir(os.path.join(path, "seasons")):
        seasonPath = os.path.join(os.path.join(path, "seasons"), seasonName)
        print("--Starting: " + seasonName)
        sO = {"title": seasonName[5:],
                "episodes":[]}
        for episodeName in os.listdir(seasonPath):
            episodePath = os.path.join(seasonPath, episodeName)
            print("----Starting: "+episodeName)
            if name == "Mister Rogers Neighborhood":
                tname = episodeName
            else:
                tname = episodeName[5:]
            if os.path.exists(os.path.join(episodePath, "info.json")):
                td = json.loads(open(os.path.join(episodePath, "info.json")).read())

            else:
                td ={
                    "title": tname,
                    "id": "",
                    "tall": "",
                    "progress": 0
                }
            if td["tall"] == "" or uDP:
                if len(glob.glob(os.path.join(episodePath,'tall*'))) == 0:
                    cap = cv2.VideoCapture(glob.glob(os.path.join(episodePath,'*.mp4'))[0])
                    for i in range(6000):
                        ret, frame = cap.read()
                    cv2.imwrite(os.path.join(episodePath, "tall.jpg"), frame)
                td["tall"] = getPointer(glob.glob(os.path.join(episodePath,'tall*'))[0])

            if td["id"] == "" or uDP:
                td["id"] = getPointer(glob.glob(os.path.join(episodePath,'*.mp4'))[0])

            if not uDP:
                with open(os.path.join(episodePath, "info.json"),'w') as file:
                    json.dump(td, file)

            sO["episodes"].append(td)

        tempData["ep_map"].append(sO)

    data["series"].append(tempData)
with open(os.path.join(cwd,str(int(time.time())) + ".json"),'w') as file:
    json.dump(data, file)
