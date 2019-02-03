
// TODO Add sensor values and timestamp for each point in the lines
// TODO Add more strokes

function usage(){
  console.log(process.argv[1]+" <filename>");
}

const args = process.argv;
if(args.length !== 3) {
  usage();
  process.exit(1);
}

const strokes = [ "#0432ff", "#ff2600", "#aa7941", "#00fcff",  "#00f900", "#ff40ff", "#ff9200", "#932092", "#ff2600", "#fefb00"];
const stroke_width = 2;

var filename = process.argv[2];

// topic to path map
var paths = {};

// ===================================
function processLine(timestamp,isodate,topic,obj){

  var o = JSON.parse(obj);

  if(!o.latitude || !o.longitude) return;

  var t = Number.parseInt(timestamp);

  var path = paths[topic];

  if(!path) {
    path = [];
    paths[topic] = path;
  }

  path.push([o.longitude, o.latitude]);
}

function processClose() {

  var features = [];

  Object.keys(paths).forEach(function(topic,index) {
    var coordinates = [];
    var path = paths[topic];
    path.forEach(function(item, index, array) {
      coordinates.push(item);
    });
    var stroke = strokes[Math.floor((Math.random() * strokes.length))];
    var feature = {
      type: "Feature",
      properties: {
        stroke: stroke,
        "stroke-width": stroke_width,
        "stroke-opacity": 1,
        id: topic
      },
      geometry: {
        type: "LineString",
        coordinates: coordinates
      }
    };
    features.push(feature);
  });

  var geojson = {
    type: "FeatureCollection",
    features: features
  };

  console.log(JSON.stringify(geojson));
};

// =======================================
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(filename)
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
