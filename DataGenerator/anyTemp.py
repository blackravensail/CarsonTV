import json

inputData = json.load(open("oldData.json","r"))
ipfsData = json.load(open("listdata.json", 'r'))["Links"]

titleList = []

outputData = {}

def getEpisodeDescription(id, season, episode, title):
    return ""

def lev(s1, s2):
    if len(s1) < len(s2):
        return lev(s2, s1)

    # len(s1) >= len(s2)
    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1 # j+1 instead of j since previous_row and current_row are one character longer
            deletions = current_row[j] + 1       # than s2
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    
    return previous_row[-1]

def ipfsLookup(folderName):
    name = folderName.replace("/","")
    levData = {"lowest":100,"lindex":0}
    i = 0
    print("trying: "+name)
    for item in ipfsData:
        if item["Name"] == name:
            return item["Hash"]
        levnum = lev(item["Name"], name)
        if levnum < levData["lowest"]:
            levData = {"lowest":levnum,"lindex":i}
        i += 1
    inp = input(ipfsData[levData["lindex"]]["Name"] + "==" + name)
    if inp == "":
        return ipfsData[levData["lindex"]]["Hash"]
    else:

        return inp





for title in inputData["series"]:
    id = title.pop("imdb_id")
    titleList.append(id)

    folderName = title["wide"].split("/")[0] + "/"
    ipfsHash = ipfsLookup(folderName)

    title["type"] = "series"

    title["wide"] = title["wide"].replace(folderName,"")
    title["tall"] = title["tall"].replace(folderName,"")

    ep_map = title["ep_map"]
    title.pop("ep_map")
    title["ep_map"] = []
    for i in range(0,len(ep_map)):
        epList = []
        for k in range(0,len(ep_map[i]["episodes"])):
            episode = {
                "title": ep_map[i]["episodes"][k]["title"],
                "video": ep_map[i]["episodes"][k]["id"].replace(folderName, ""),
                "image": ep_map[i]["episodes"][k]["tall"].replace(folderName, ""),
                "description": getEpisodeDescription(id, i, k, ep_map[i]["episodes"][k]["title"])
            }
            epList.append(episode)
        season = {
            "title": ep_map[i]["title"],
            "episodes": epList
        }
        title["ep_map"].append(season)

    outputData[id] = title

for title in inputData["movies"]:
    id = title.pop("imdb_id")
    titleList.append(id)

    title["type"] = "movie"

    folderName = title["wide"].split("/")[0] + "/"
    
    title["wide"] = title["wide"].replace(folderName,"")
    title["tall"] = title["tall"].replace(folderName,"")

    title["trailer"] = title.pop("trailer_id").replace(folderName,"")
    title["feature"] = title.pop("main_id").replace(folderName,"")

    outputData[id] = title


json.dump(outputData, open("firstTry.json", "w"))

