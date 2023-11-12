import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import WKT from "ol/format/WKT";
import { fromLonLat, transform } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
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
        dataProjection: "EPSG:900913",
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
        dataProjection: "EPSG:900913",
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

    const multipolygonLayer = new VectorLayer({
      source: multipolygonSource,
    });
    const centroidLayer = new VectorLayer({ source: centroidSource });

    // Create map
    const map = new Map({
      target: mapRef.current,
      layers: [
        // new TileLayer({ source: new OSM() }),
        multipolygonLayer,
        centroidLayer,
      ],
      view: new View({
        center: [0, 0],
        zoom: 4,
        // projection: "EPSG:3857",
      }),
    });

    return () => map.setTarget(undefined); // Clean up on unmount
  }, [props.multipolygonWKTs, props.centroidWKTs]);

  return <div ref={mapRef} style={{ width: "100%", height: height }} />;
};

export default MouzaMap;
