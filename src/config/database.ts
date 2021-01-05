import Redis from "vn-cms-redis";
import CacheFile from "vn-cms-cache";
import MongoDB from "core/model/MongoDB";


export default {
    "default": "MongoDB",
    "driver": MongoDB,
    "_id": "_id",
    "cache": false,
    "network": {
        "DATABASE": "PNJ",
        "USERNAME": "pnj",
        "PASSWORD": "FkYkKnKPRnop79Xt"
    },
    "MongoDB": {
        "DATABASE": "PNJ",
        "USERNAME": "pnj",
        "PASSWORD": "FkYkKnKPRnop79Xt",
        "stringConnect": "mongodb+srv://pnj:FkYkKnKPRnop79Xt@cluster0.ticyv.mongodb.net"
        // "stringConnect": "mongodb://localhost:27017"
    },
    "MySQL": {

    }
}