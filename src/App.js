import React, {useState} from 'react';
import './App.css'
import ReactMapGL, {Marker} from 'react-map-gl'

//create component for dinamic adding
const MarkerComponent = ({lat, lng ,name}) => 
                <Marker latitude={lat} longitude={lng}>
                    <img src={"./images/marker.jpg"} className="marker_image"  />
                    <p>{name}</p>
                </Marker>;


class App extends React.Component {     
    
    state = {
        viewport: {
            width: "100vw",
            height: "100vh",
          center: [-74.5, 40], 
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
        fetch("http://localhost:8000/markers", {
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
              console.log();
          })
      }
    
     componentWillUnmount() {
       clearInterval(this.interval);
     }


     updateMarkers = (data) => {
       try {
            var list = []

            data.map((item) => {     
                  
                list.push(item) ;
            } );

            this.setState({
                markersList: list       
            });
          // console.log(list);
       } catch (error) {
            console.log(error);
       }
        
     }

    render(){

        return (
        <div className="mainDiv" >
        <h1>Entities Presenter</h1>

        <ReactMapGL       
        
        {...this.state.viewport}
         mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
         {...this.state.viewport}
        onViewportChange={(viewport) => {
           { this.setState({ viewport }) }
        }}             
          
         mapStyle="mapbox://styles/jennysmolensky/ckkh5eo7s10tr17lo6cxcegw7">

           
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
        
        <div id='map'></div>
        </div>
        )};
}

export default App;

