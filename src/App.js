import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import MouzaMap from './components/MouzaMap/MouzaMap';

const App = () =>  {

  const [multipolygonData, setMultipolygonData] = useState([]);
  const [centroidData, setCentroidData] = useState([]);

  useEffect(() => {
    // Fetch multipolygon data
    fetch('assets/json/sheetMap_populateLayerData.json')
      .then(response => response.json())
      .then(data => {
        // console.log("setMultipolygonData",data.features[0]);
        setMultipolygonData(data.features)
      });

    // Fetch centroid data
    fetch('assets/json/sheetMap_populateCentroidData.json')
      .then(response => response.json())
      .then(data => setCentroidData(data.features));
  }, []);


  return (
    <MouzaMap multipolygonWKTs={multipolygonData} centroidWKTs={centroidData} />
  );
}

export default App;
