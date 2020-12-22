import Redis from "vn-cms-redis";


export default {
    "default": "MongoDB",
    "_id": "_id",
    "cache": new Redis,
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
    },
    "MySQL": {

    }
}