import React from 'react';
import './App.css';
import ReactMapGL, {Marker, NavigationControl} from 'react-map-gl'


//create component for dinamic adding
const MarkerComponent = ({lat, lng ,name}) => 
                <Marker latitude={lat} longitude={lng}>
                    <img src={"./images/marker.jpg"} className="marker_image"  />
                    <p>{name}</p>
                </Marker>;

const REACT_APP_MAPBOX_TOKEN = "pk.eyJ1IjoiamVubnlzbW9sZW5za3kiLCJhIjoiY2trZ3d0OHVyMXBnOTJvcGFnaWliNmgwdiJ9.GZLrZpn-DmQ0ScdjNp1p3A";


const NavigationControlStyle ={

    position: 'absolute',
    top: 30,
    left: 30, 
};

class App extends React.Component {     
    
    state = {
        viewport: {
            width: "100%",
            height: "100vh",
          zoom: 1
        },
        markersList: []
      };

      componentDidMount () {

        this.getMarkers();
        this.interval = setInterval(() => {
          this.getMarkers();
        }, 6000); //every 6 seconds - request to server
      }


      getMarkers() {
        let local_host_path = "http://localhost:8000/";
        let web_server_path = "https://jennysmolensky.pythonanywhere.com/";
        
        let path = web_server_path + "markers";
        try{
              fetch(path, {
                method: "GET",
              })
                .then( (resposne) => {
                    resposne.json().then((data) => {
                        console.log(data);     
                        if (data != "")             
                          this.updateMarkers(data);
                    });
                })
                .catch(error => {
                    console.log(error);
                })
                
            } catch(error){
              console.log(error);
            }
      }
    
     componentWillUnmount() {
       clearInterval(this.interval);
     }


     updateMarkers = (data) => {
        var list = []

        data.map((item) => {     
               
            list.push(item) ;
         } );

        this.setState({
            markersList: list       
        });
       // console.log(list);
     }

    render(){

        return (
        <div className="mainDiv" >
        <h1>Entities Presenter</h1>

        <ReactMapGL  className="map"
        {...this.state.viewport}
        mapboxApiAccessToken={REACT_APP_MAPBOX_TOKEN}
         {...this.state.viewport}
        onViewportChange={(viewport) => {
           { this.setState({ viewport }) }
        }}             
          container="mainDiv"
          mapStyle="mapbox://styles/jennysmolensky/ckkh5eo7s10tr17lo6cxcegw7"
         >
             
        <div style={NavigationControlStyle} > 
            <NavigationControl   />
        </div>  


             {this.state.markersList.map((marker, i) =>{
              return(
                <MarkerComponent
                  lat={marker.latitude}
                  lng={marker.longitude}
                  name={marker.name}
                />

              )
            })} 
             {/*static markers <Marker className="marker"
                latitude={31.5313113}
                longitude={31.5313113}>
                    <img className="marker_image" src="./images/marker.jpg" />
                </Marker>
                <Marker className="marker"
                latitude={80}
                longitude={51.5313113}>
                    <img className="marker_image" src="./images/marker.jpg" />
                </Marker>
                <Marker className="marker"
                latitude={31.7313113}
                longitude={139.5313113}>
                    <img className="marker_image" src="./images/marker.jpg" />
                </Marker> */}
           
        </ReactMapGL> 
        
        </div>
        )};
}

export default App;

