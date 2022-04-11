///////////////// 팝업키/////////////////////
const key = 'gdGSvycDh0N9kwCwDiiL';
const attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
   /**
  * Create an overlay to anchor the popup to the map.
  */
/**
 * Elements that make up the popup.
 */
 const container = document.getElementById('popup');
 const content = document.getElementById('popup-content');
 const closer = document.getElementById('popup-closer');

 const overlay = new ol.Overlay({
   title: 'overlay',
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};


// TMS 불러오기
let imagery = new ol.layer.Tile({
  title :'base',
  crossOrigin:'anonymous',
  source: new ol.source.XYZ({
    url: 'https://d2map.com:7443/TARTMS/World_TMS/{z}/{x}/{-y}.png',
    maxZoom: 20,
    crossOrigin: 'anonymous',
  }),
});
///////팝업맵
let popupmap = new ol.layer.Tile({
  title: 'popupmap',
  source: new ol.source.XYZ({
    attributions: attributions,
    url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + key,
    tileSize: 512,
  })
});

// style 지정 (시작)
let style = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new ol.style.Stroke({
    color: 'rgba(0, 0, 0, 0.5)',
    lineDash: [10, 10],
    width: 2,
  }),
  image: new ol.style.Circle({
    radius: 5,
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
  }),
});

let labelStyle = new ol.style.Style({
  text: new ol.style.Text({
    font: '14px Calibri,sans-serif',
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    padding: [3, 3, 3, 3],
    textBaseline: 'bottom',
    offsetY: -15,
  }),
  image: new ol.style.RegularShape({
    radius: 8,
    points: 3,
    angle: Math.PI,
    displacement: [0, 10],
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
  }),
});

let tipStyle = new ol.style.Style({
  text: new ol.style.Text({
    font: '12px Calibri,sans-serif',
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
    padding: [2, 2, 2, 2],
    textAlign: 'left',
    offsetX: 15,
  }),
});

let modifyStyle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 5,
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
  }),
  text: new ol.style.Text({
    text: 'Drag to modify',
    font: '12px Calibri,sans-serif',
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    padding: [2, 2, 2, 2],
    textAlign: 'left',
    offsetX: 15,
  }),
});

let segmentStyle = new ol.style.Style({
  text: new ol.style.Text({
    font: '12px Calibri,sans-serif',
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
    padding: [2, 2, 2, 2],
    textBaseline: 'bottom',
    offsetY: -12,
  }),
  image: new ol.style.RegularShape({
    radius: 6,
    points: 3,
    angle: Math.PI,
    displacement: [0, 8],
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
  }),
});
let segmentStyles = [segmentStyle];
// style 지정 (끝)
//////////////////////////////////////////
let source = new ol.source.Vector();
const osmSource = new ol.source.OSM();



let modify = new ol.interaction.Modify({
  source: source,
  style: modifyStyle
});

let vector = new ol.layer.Vector({
  source: source,
  style: function (feature) {
    return styleFunction(feature, showSegments.checked);
  },
});
///////////////////////////////////////////
const extent = ol.proj.get('EPSG:3857').getExtent().slice();
extent[0] += extent[0];
extent[2] += extent[2];

let view = new ol.View({
  center: ol.proj.fromLonLat([127.0, 37.65]),
  zoom: 5,
  extent,
})




// map 불러오기
let map = new ol.Map({
  layers: [imagery,vector, popupmap],
  target: 'map',
  view: view,
  controls: [],
  overlays: [overlay],
  interactions: ol.interaction.defaults().extend([new ol.interaction.DragRotateAndZoom()]),
});

// WMS 불러오기
let LAYER_WMS = new ol.layer.Tile({
  title: "LAYER_WMS",
        	source: new ol.source.TileWMS({
	            url: 'https://d2map.com/geoserver/D2Map/wms',
	            params: {
              	  LAYERS: 'afa001,sudo',
	                VERSION: '1.1.0',
              	  SRS: 'EPSG:4326',
	                TRANSPARENT: true,
	            },
            	serverType: 'geoserver',
            	crossOrigin: 'Anonymous', //미 선언시 Export(png, jpg) 오류 발생
	        }),
          opacity: 1.0,
          visible:true
	 });
map.addLayer(LAYER_WMS);



///////==========================================

// title로 checkbox 분류
function toggleLayer(eve) {
    var lyrname = eve.target.value;
    var checkedStatus = eve.target.checked;
    var lyrList = map.getLayers();

    lyrList.forEach(function (element) {
        if (lyrname == element.get('title')) {
            element.setVisible(checkedStatus);
        }
    });
}

// 마우스에 따라 경도 위도 표시
var mousePosition = new ol.control.MousePosition({
  bar: true,
  text: true,
    className: 'mousePosition',
    projection: 'EPSG:4326',
    coordinateFormat: function (coordinate) {
        return ol.coordinate.format(coordinate, ' {y}º N , {x}º E', 1);
    }
});

map.addControl(mousePosition);

// zoom에 따라 scale 값 확인
var scaleControl = new ol.control.ScaleLine({
  bar: true,
  text: true
})


map.addControl(scaleControl);
////////팝업

function selectStyle(feature) {
  const color = feature.get('COLOR') || '#eeeeee';
  selected.getFill().setColor(color);
  return selected;
}


const selectAltClick = new ol.interaction.Select({
  
  style: selectStyle,
  condition: function (mapBrowserEvent) {
    return click(mapBrowserEvent) && altKeyOnly(mapBrowserEvent);
  },
});
 
let onpopup = document.getElementById('popupInfo');

map.on('singleclick', function (evt) {
 
  const coordinate = evt.coordinate;
  const hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinate));
if(onpopup.checked){

  content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';

  overlay.setPosition(coordinate);
}
});