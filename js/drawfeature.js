const typeSelect = document.getElementById('type'); // type 지정 전역함수
const showSegments = document.getElementById('segments'); // checkbox 지정 전역함수

const clearPrevious = document.getElementById('clear'); // clear(지우기) 지정 전역함수

let tipPoint;

map.addInteraction(modify);

let draw; //도형그리기 전역함수

function addInteraction() {
  let drawType = typeSelect.value;
  let activeTip =
    'Click to continue drawing the ' ;
  let idleTip = 'Click to start measuring';
  let tip = idleTip;
  draw = new ol.interaction.Draw({
    source: source,
    type: drawType,
    style: function (feature) {
      return styleFunction(feature, showSegments.checked, drawType, tip);
    },
  });
  
  draw.on('drawstart', function () {
    if (clearPrevious.checked) {
      source.clear();
    }
    modify.setActive(false);
    tip = activeTip;
  });

  draw.on('drawend', function () {
    modifyStyle.setGeometry(tipPoint);
    modify.setActive(true);
    map.once('pointermove', function () {
      modifyStyle.setGeometry();
    });
    tip = idleTip;
  });

  modify.setActive(true);
  map.addInteraction(draw);
}

function addInteraction() {
  let value = typeSelect.value;
 
  //원 //논이 아니다
 if(value !== 'None') {
    let geometryFunction;
    
    
//네모
    if (value === 'Square') {
      value = 'Circle';
      geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
     
//직사
    } else if (value === 'Box') {
      value = 'Circle';
      geometryFunction = ol.interaction.Draw.createBox();

//----------------------별
    } else if (value === 'Star') {
      value = 'Circle';
      
      geometryFunction = function (coordinates, geometry) {
        const center = coordinates[0];
        const last = coordinates[coordinates.length - 1];
        const dx = center[0] - last[0];
        const dy = center[1] - last[1];
        const radius = Math.sqrt(dx * dx + dy * dy);
        const rotation = Math.atan2(dy, dx);
        const newCoordinates = [];
        const numPoints = 10;
        for (let i = 0; i < numPoints; ++i) {
          const angle = rotation + (i * 2 * Math.PI) / numPoints;
          const fraction = i % 2 === 0 ? 1 : 0.5;
          const offsetX = radius * fraction * Math.cos(angle);
          const offsetY = radius * fraction * Math.sin(angle);
          newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
        }
        newCoordinates.push(newCoordinates[0].slice());
        if (!geometry) {
          geometry = new ol.geom.Polygon([newCoordinates]);
        } else {
          geometry.setCoordinates([newCoordinates]);
        }
        return geometry;
      };
    }//-------------------------------
    let activeTip =
      'Click to continue drawing the ' +
      (value === 'Polygon' ? 'polygon' : 'line');
    let idleTip = 'Click to start measuring';
    let tip = idleTip;
      draw = new ol.interaction.Draw({
      source: source,
      type: value,
      geometryFunction: geometryFunction,
      style: function (feature) {
      return styleFunction(feature, showSegments.checked, value, tip);
    },
      });
    draw.on('drawstart', function () {
    if (clearPrevious.checked) {
      source.clear();
    }
    modify.setActive(false);
    tip = activeTip;
  });

  draw.on('drawend', function () {
    modifyStyle.setGeometry(tipPoint);
    modify.setActive(true);
    map.once('pointermove', function () {
      modifyStyle.setGeometry();
    });
    tip = idleTip;
  });
    map.addInteraction(draw);
  }
}

/**
 * Handle change event.
 */
typeSelect.onchange = function () {
  map.removeInteraction(draw);
  addInteraction();
};

addInteraction();

document.getElementById('undo').addEventListener('click', function () {
  draw.removeLastPoint();
});

showSegments.onchange = function () {
  vector.changed();
  draw.getOverlay().changed();
};
