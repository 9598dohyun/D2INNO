let formatLength = function (line) {
  let length = ol.sphere.getLength(line);
  var velocity = document.getElementById("velocityValue");
  var value_velocity = Number(velocity.value);
  let output = document.getElementById("output");
  let distance =  Math.round((length / 1000) ) ;
  let hour = Math.round(((length / 1000) ) ) / value_velocity;
  let minute = (((Math.round(((length / 1000) ) ) / value_velocity)*3600)%3600)/60;
  //let second = ((Math.round(((length / 1000) ) ) / value_velocity)*3600)%60;
  if (length > 100) {
    if(value_velocity == false){
    output = distance+ ' km ';
    }else if(value_velocity > 0){
      output = distance+ ' km / ' + value_velocity + ' km/h / ' + Math.floor(hour)+ '시' + Math.floor(minute)+'분';
    }
  } else {
    output = Math.round(length * 100) / 100 + ' m' + value_velocity + ' m/s / ' + Math.round(((length / 1000) * 100) / 100) / value_velocity + ' s';
  }
 
  return output;
};
let formatArea = function (polygon) {
  let area = ol.sphere.getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) )  + ' km\xB2';
  } else {
    output = Math.round(area * 100) / 100 + ' m\xB2';
  }
  return output;
};

function styleFunction(feature, segments, drawType, tip) {
  let styles = [style];
  let geometry = feature.getGeometry();
  let type = geometry.getType();
  let point, label, line;
  if (!drawType || drawType === type) {
    if (type === 'Polygon') {``
      point = geometry.getInteriorPoint();
      label = formatArea(geometry);``
      line = new ol.geom.LineString(geometry.getCoordinates()[0]);
    } else if (type === 'LineString') {
      point = new ol.geom.Point(geometry.getLastCoordinate());
      label = formatLength(geometry);
      line = geometry;
    }
  }
  if (segments && line) {
    let count = 0;
    line.forEachSegment(function (a, b) {
      let segment = new ol.geom.LineString([a, b]);
      let label = formatLength(segment);
      if (segmentStyles.length - 1 < count) {
        segmentStyles.push(segmentStyle.clone());
      }
      let segmentPoint = new ol.geom.Point(segment.getCoordinateAt(0.5));
      segmentStyles[count].setGeometry(segmentPoint);
      segmentStyles[count].getText().setText(label);
      styles.push(segmentStyles[count]);
      count++;
    });
  }
  if (label) {
    labelStyle.setGeometry(point);
    labelStyle.getText().setText(label);
    styles.push(labelStyle);
  }
  if (
    tip &&
    type === 'Point' &&
    !modify.getOverlay().getSource().getFeatures().length
  ) {
    tipPoint = geometry;
    tipStyle.getText().setText(tip);
    styles.push(tipStyle);
  }
  return styles;
}