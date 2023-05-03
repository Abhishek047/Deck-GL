import { useState } from "react";
import { HexagonMap } from "./component/Map";
import { csv } from "d3-request";

function App() {
  // const DATA_URL =
  //   'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv'; // eslint-disable-line
  // const DATA_URL =
  //   'https://firebasestorage.googleapis.com/v0/b/app-thoughts.appspot.com/o/CSVFile.csv?alt=media&token=e3aa6e68-a4e8-4578-98fb-976b15cbebfe'; // eslint-disable-line
  const DATA_URL =
    "https://firebasestorage.googleapis.com/v0/b/app-thoughts.appspot.com/o/DeckGL%20-%20Sheet1.csv?alt=media&token=67f84953-a141-4b8a-b14a-5960bda9758b"; // eslint-disable-line

  const [data, setData] = useState();
  csv(DATA_URL, (error, response) => {
    if (!error) {
      const data = response.map((d) => ({ position: [Number(d.lng), Number(d.lat)], IRR: d.IRR }));
      setData(data);
    }
  });

  return (
    <div className='App'>
      <HexagonMap data={data} />
    </div>
  );
}

export default App;
