import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import WKT from "ol/format/WKT";
import Feature from "ol/Feature";
import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import Projection from "ol/proj/Projection";
import Strategy from "ol/loadingstrategy";

/**
 *
 * @param {Object} props
 * @param {Array} props.multipolygonWKTs
 * @param {Array} props.centroidWKTs
 * @returns
 */
const MouzaMap = (props) => {
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    const updateHeight = () => {
      const newHeight = `${window.innerHeight - 10}px`;
      setHeight(newHeight);
    };
    window.addEventListener("resize", updateHeight);
    updateHeight();
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const mapRef = useRef();

  useEffect(() => {
    const format = new WKT();

    // Convert WKT strings to features
    const multipolygonFeatures = props.multipolygonWKTs.map((item) => {
      const feature = format.readFeature(item.polygon, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      });
      feature.setProperties({
        plot: item.plotno,
        area: item.plotArea,
      });
      return feature;
    });
    const centroidFeatures = props.centroidWKTs.map((item) => {
      const feature = format.readFeature(item.point, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      });
      feature.setProperties({
        plot: item.plotno,
        rend_plotno: item.rend_plotno,
      });
      return feature;
    });

    // Create vector sources
    const multipolygonSource = new VectorSource({
      features: multipolygonFeatures,
    });
    const centroidSource = new VectorSource({ features: centroidFeatures });

    const multipolygonLayer = new VectorLayer({ source: multipolygonSource });
    const centroidLayer = new VectorLayer({ source: centroidSource });

    // Create vector layers
    // const multipolygonLayer = new VectorLayer({
    //     source: multipolygonSource,
    //     style : function (feature) {
    //         return new Style({
    //             image: new CircleStyle({
    //                 radius: 15,
    //                 fill: new Fill({colour: '#ffcc66'}),
    //                 stroke: new Stroke({color: '#cc6633', width: 1})
    //             }),
    //             text: new Text({
    //                 text: feature.get('plot'),
    //                 font: 'bold ' + getFontSize(feature) + 'px BNB-TTBidisha',
    //                 fill: new Fill({ color: 'blue' })
    //             })
    //         })
    //     }
    // });
    // const centroidLayer = new VectorLayer({
    //     source: centroidSource,
    //     style: function (feature) {
    //       return new Style({
    //         image: new CircleStyle({
    //           radius: 0,
    //           fill: new Fill({ color: '#ffcc66' }),
    //           stroke: new Stroke({ color: '#cc6633', width: 1 })
    //         }),
    //         text: new Text({
    //           text: getLabel(feature),
    //           offsetX: getLOffsetX(feature),
    //           offsetY: getLOffsetY(feature),
    //           font: 'bold ' + getFontSizeCen(feature) + 'px BNB-TTBidisha',
    //           fill: new Fill({ color: 'blue' })
    //         })
    //       });
    //     }
    // });

    // Function to calculate font size based on zoom level
    // function getFontSize(feature) {
    //   let defaultSize = feature.get('map').getView().getZoom();
    //   if (defaultSize - 14 > 14) {
    //     let zoomLevel = defaultSize - 14;
    //     defaultSize = defaultSize + zoomLevel + 14;
    //   }
    //   return defaultSize;
    // }

    // function getLabel(feature) {
    //   if (feature.get('map').getView().getZoom() >= 15) {
    //     return feature.get('rend_plot');
    //   } else {
    //     return '';
    //   }
    // }

    // function getLOffsetX(feature) {
    //   let zoom = feature.get('map').getView().getZoom();
    //   if (zoom >= 26) {
    //     return 20;
    //   } else if (zoom >= 23) {
    //     return 16;
    //   } else if (zoom >= 20) {
    //     return 14;
    //   } else if (zoom >= 17) {
    //     return 10;
    //   } else {
    //     return 3;
    //   }
    // }

    // function getLOffsetY(feature) {
    //   let zoom = feature.get('map').getView().getZoom();
    //   if (zoom >= 23) {
    //     return 9;
    //   } else if (zoom >= 20) {
    //     return 6;
    //   } else if (zoom >= 17) {
    //     return 4;
    //   } else {
    //     return 1;
    //   }
    // }

    // function getFontSizeCen(feature) {
    //   let defaultSize = feature.get('map').getView().getZoom();
    //   if (defaultSize > 15) {
    //     let zoomLevel = (defaultSize - 15) * 6;
    //     defaultSize = defaultSize + zoomLevel;
    //   }
    //   return defaultSize - 5;
    // }

    // Create map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        multipolygonLayer,
        centroidLayer,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
        projection: "EPSG:4326",
      }),
    });

    return () => map.setTarget(undefined); // Clean up on unmount
  }, [props.multipolygonWKTs, props.centroidWKTs]);

  return <div ref={mapRef} style={{ width: "100%", height: height }} />;
};

export default MouzaMap;
