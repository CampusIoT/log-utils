# Explication
Auteur: Didier DONSEZ

## decodePayload.js
Ce script décode les valeurs des capteurs des devices à partir d'un journal de messages et d'un décodeur de messages.

Les décodeurs de message pour plusieurs devices de différents fabricants se trouvent dans le dépôt Github

```bash
git clone https://github.com:CampusIoT/payload-codec.git  
cd payload-codec
tree src/main/javascript/
```

## filter.sh
Ce script décode les valeurs des capteurs de plusieurs devices installés sur le campus de Grenoble.

## LOG
Les fichiers .log contiennent les journaux des messages des devices gérés par le serveur lora.coampusiot.imag.fr

* Le premier champ est le timestamp au format epoch (millisecondes depuis 1/1/1970)
* Le deuxième champ est le type du message (MSG, ...)
* Le troisième champ est le topic du message
* Le quatrième champ est le texte du message (au format JSON) lorsque le type est MSG

## DEC
Les fichiers .dec contiennent la charge utile (ie fRMPayload) des messages des devices gérés par le serveur lora.coampusiot.imag.fr

Quand la charge utile contient plusieurs valeurs d'une mesure pris à des intervalles de temps différents, le décodeurs peut séparer la charge utile en plusieurs lignes.

* Le premier champ est le timestamp au format epoch (millisecondes depuis 1/1/1970)
* Le deuxième champ est le timestamp au format ISO8601
* Le troisième champ est l'identifiant du device dans l'application (le format est APPNAME/DEVEUI)
* Le quatrième champ est le texte (au format JSON) de la valeur des capteurs du device à l'instant du timestamp.
