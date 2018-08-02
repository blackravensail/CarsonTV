import json
import os
import requests
from PIL import Image
from imdbpie import Imdb
import glob
import cv2
import subprocess
import time
import sys
from random import randint
import json

cwd = os.getcwd()
imdb = Imdb()
mainList = json.load("")

targetDir = ""

def processTitle(path, hasID):
    if (hasID):
        id = path.split("\\")[-1].split("[")[-1].replace(']','')
        if id[0:2] == "tt":
            proccessIMDB(path, id)
        else:
            processNonIMDB(path, id)
    else:

        
def processNonIMDB(path, id)

def proccessIMDB(path, id):
    imdbTitle = imdb.get_title(id)
    if id not in mainList:
        mainList[id] = {
                "type":"",
                "description":"",
                "description":"",
                "genres":[],
                "tall":"",
                "wide":"",
                "location":{},
                "title":"",

        }
    
    if
