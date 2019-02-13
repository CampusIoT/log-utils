#!/bin/bash

# Extract applications' messages (tx/rx)
extractApplication(){
  rm application.log application.log.gz
  for f in msg-*.log.gz
  do
    gunzip -c $f | grep application  >> application.log
  done
  gzip application.log
  gunzip -c application.log.gz | wc -l
}

# Extract gateways' messages (tx/rx)
extractGateway(){
  rm gateway.log gateway.log.gz
  for f in msg-*.log.gz
  do
    gunzip -c $f | grep gateway  >> gateway.log
  done
  gzip gateway.log
  gunzip -c gateway.log.gz | wc -l
}

filterOnName(){
  NAME=$1
  gunzip -c application.log.gz | grep $NAME > ${NAME}.log
  gzip ${NAME}.log
  NBLINES=$(gunzip -c ${NAME}.log.gz | wc -l)
  echo "$NBLINES messages for $NAME"
}

filterAndDecode(){
  APPNAME=$1
  DECODER=$2
  filterOnName $APPNAME
  gunzip -c $APPNAME.log.gz | node decodePayload.js - ../payload-codec/src/main/javascript/$DECODER > $APPNAME.dec
  gzip $APPNAME.dec
}

filterAndDecodeAndGeojson(){
  APPNAME=$1
  DECODER=$2
  filterAndDecode $APPNAME $DECODER
  gunzip -c $APPNAME.dec.gz | node dec2geojson.js - > $APPNAME.geojson
}

# Extract device messages (tx/rx)
extractApplication
extractGateway

# OY1100 DEVEUI=1557344e72397020 (IAE)
DEVEUI=1557344e72397020
DECODER=onyield/onyield_oy1100_codec.js
filterAndDecode $DEVEUI $DECODER

# ERS CO2 DEVEUI=a81758fffe03926d (IAE)
# ELSYS
DEVEUI=a81758fffe03926d
DECODER=elsys/elsys_codec.js
filterAndDecode $DEVEUI $DECODER

# ELSYS
APPNAME=ELSYS
DECODER=elsys/elsys_codec.js
filterAndDecode $APPNAME $DECODER

# LAIRD
APPNAME=LAIRD
DECODER=laird/laird_sentriusrs_codec.js
filterAndDecode $APPNAME $DECODER

# SENSLAB
APPNAME=SENSLAB
DECODER=sensinglabs/sensinglabs_senlabh_codec.js
filterAndDecode $APPNAME $DECODER

# ALLORA
APPNAME=ALLORA
DECODER=allora/allora_codec.js
filterAndDecode $APPNAME $DECODER

# Ascoel
APPNAME=ASCOEL_CMTH
DECODER=ascoel/ascoel_codec.js
filterAndDecode $APPNAME $DECODER



# Adeunis FTD
APPNAME=FTD
DECODER=adeunisrf/adeunisrf_ftd_codec.js
filterAndDecodeAndGeojson $APPNAME $DECODER

# Adeunis DEMOMOTE
APPNAME=DEMOMOTE
DECODER=adeunisrf/adeunisrf_demomote_codec.js
filterAndDecodeAndGeojson $APPNAME $DECODER

# Semtech LORAMOTE
APPNAME=LORAMOTE
DECODER=semtech/semtech_loramote_codec.js
filterAndDecodeAndGeojson $APPNAME $DECODER
