
function usage(){
  console.log(process.argv[1]+" <filename> <codec_path>");
}

const args = process.argv;
if(args.length !== 4) {
  usage();
  process.exit(1);
}

var filename = process.argv[2];

var input;
if(filename === "-") {
  input = process.stdin;
} else {
  input = require('fs').createReadStream(filename);
}

var codec_path = process.argv[3];

var decoder = require(codec_path).Decoder;

// ===================================
function processLine(timestamp,type,topic,msg){

  var m = JSON.parse(msg);

  if(!m.data || !m.fPort || !m.devEUI) return;

  var deveui = m.devEUI;
  var applicationName = m.applicationName;
  var fPort = m.fPort;
  var payload = Buffer.from(m.data,'base64');

  var t =Number.parseInt(timestamp);

  if(decoder.decodeUpWithTimestamp) {
    var obj = decoder.decodeUpWithTimestamp(t,fPort,payload);
    obj.forEach(function(o){
      var d =new Date(o.timestamp);
      console.log(o.timestamp+","+d.toISOString()+","+applicationName+"/"+deveui+","+JSON.stringify(o.object));
    });
  } else {
    var obj = decoder.decodeUp(fPort,payload);
    var d =new Date(t);
    console.log(timestamp+","+d.toISOString()+","+applicationName+"/"+deveui+","+JSON.stringify(obj));
  }
}

function processClose() {
}

// =======================================
var lineReader = require('readline').createInterface({
  input: input
});

lineReader.on('line', function (line) {
  let idx1 = line.indexOf(",",0);
  let idx2 = line.indexOf(",",idx1+1);
  let idx3 = line.indexOf(",",idx2+1);

  processLine(
    parseInt(line.substring(0,idx1)),
    line.substring(idx1+1,idx2),
    line.substring(idx2+1,idx3),
    line.substring(idx3+1)
  );
}).on('close', () => {
  processClose();
  process.exit(0);
});
