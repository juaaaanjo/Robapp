import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authActions";
import mapStyle from "../../assets/mapStyle/mapStyle.json";
import ReportButton from "../../assets/components/ReportButton/ReportButton";

const HomePage = () => {
  const dispatch = useDispatch();

  const [neighborhoodPolygon, setNeighborhoodPolygon] = useState(null);
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userDot, setUserDot] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [incidentData, setIncidentData] = useState({
    description: "",
    type: "Accident", // Default type
  });

  const [userCurrentLatitude, setUserCurrentLatitude] = useState();
  const [userCurrentLongitude, setUserCurrentLongitude] = useState();
  const [locations, setLocations] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [selectedIncidencia, setSelectedIncidencia] = useState(null);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwt");
  
        // Fetch ubicaciones
        const ubicacionesResponse = await fetch("http://localhost:3001/ubicaciones", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
  
        if (ubicacionesResponse.ok) {
          const ubicacionesData = await ubicacionesResponse.json();
          setLocations(ubicacionesData.data);
          console.log(ubicacionesData.data);
        } else {
          console.error("Error fetching ubicaciones:", await ubicacionesResponse.json());
        }
  
        // Fetch incidencias
        const incidenciasResponse = await fetch("http://localhost:3001/incidence", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
  
        if (incidenciasResponse.ok) {
          const incidenciasData = await incidenciasResponse.json();
          setIncidencias(incidenciasData.data); // Assuming you have a state for incidencias
          console.log(incidenciasData.data);
        } else {
          console.error("Error fetching incidencias:", await incidenciasResponse.json());
        }
      } catch (error) {
        console.error("Error during API request:", error);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    loadMap();
  }, [locations, incidencias]);

  const drawIncidenciasMarkers = (google, map, incidencias) => {
    incidencias.forEach((incidenciaData) => {
      const marker = new google.maps.Marker({
        position: { lat: incidenciaData.Latitud, lng: incidenciaData.Longitud },
        map: map,
        title: incidenciaData.Tipo, // You can customize the title
        // You can add more options as needed
      });
  
      // Add a click event listener for the marker, if needed
      marker.addListener("click", () => {
        setSelectedIncidencia(incidenciaData);
      });
    });
  };

  const drawPolygons = (google, map, locations) => {
    locations.map((locationData) => {
      const coordinates = [
        { lat: locationData.Latitud, lng: locationData.Longitud },
        { lat: locationData.Latitud2, lng: locationData.Longitud2 },
        { lat: locationData.Latitud3, lng: locationData.Longitud3 },
      ];

      const polygon = new google.maps.Polygon({
        paths: coordinates,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
      });

      polygon.setMap(map);
    });
  };

  const initializeMap = (google, userLocation) => {
    const mapContainer = mapContainerRef.current;

    console.log('contenedor mapa:', mapContainer)
    if (mapContainer) {
      const mapOptions = {
        center: userLocation,
        zoom: 16,
        styles: mapStyle,
        mapTypeId: "roadmap",
        disableDefaultUI: true,
      };

      const newMap = new google.maps.Map(mapContainer, mapOptions);
      setMap(newMap);

      // Add a blue dot for the user's current position
      const dot = new google.maps.Circle({
        center: userLocation,
        radius: 5,
        strokeColor: "#4285F4",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#4285F4",
        fillOpacity: 0.6,
        map: newMap,
      });

      setUserDot(dot);

      console.log("ubicaciones", locations);

      drawPolygons(google, newMap, locations);

      drawIncidenciasMarkers(google, newMap, incidencias);
    }
  };

  const updateDotPosition = (position) => {
    if (userDot) {
      userDot.setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      // Recenter the map based on the user's new position
      map.panTo({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }
  };

  const loadMap = () => {
    const google = window.google;

    if (google) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            console.log("Ubicacion usuario", userLocation);
            setUserCurrentLongitude(position.coords.longitude);
            setUserCurrentLatitude(position.coords.latitude);
            initializeMap(google, userLocation);
            updateDotPosition(position);
          },
          (error) => {
            console.error("Error getting user's location:", error);
            initializeMap(google, { lat: 37.7749, lng: -122.4194 });
          }
        );

        navigator.geolocation.watchPosition(
          (position) => {
            updateDotPosition(position);
          },
          (error) => {
            console.error("Error updating user's location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by your browser.");
        initializeMap(google, { lat: 37.7749, lng: -122.4194 });
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleToggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedIncidencia(null);
  };

  const handleDescriptionChange = (event) => {
    setIncidentData({
      ...incidentData,
      description: event.target.value,
    });
  };

  const handleTypeChange = (event) => {
    setIncidentData({
      ...incidentData,
      type: event.target.value,
    });
  };

  const handleReportIncident = async () => {
    try {
      const token = localStorage.getItem("jwt");
  
      const response = await fetch("http://localhost:3001/incidence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          Tipo: incidentData.type,
          Descripcion: incidentData.description,
          UbicacionID: locations[1]?.UbicacionID,
          Latitud: userCurrentLatitude,
          Longitud: userCurrentLongitude,
        }),
      });
  
      if (response.ok) {
        console.log("Incidence created successfully");

      } else {
        console.error("Error creating incidence:", await response.json());
      }
    } catch (error) {
      console.error("Error during API request:", error);
    }
    setIsModalVisible(false);
  };

  const getLocationName = (locationID) => {
    const location = locations.find((loc) => loc.UbicacionID === locationID);
    return location ? location.nombre : "Unknown Location";
  };


  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", backgroundColor: '#FF5858' }}>
        <h2 style={{ color: '#ffffff', marginLeft: 20 }}>ROBAPP</h2>
        <div style={{ marginLeft: 'auto', marginRight: 20 }}>
          <ReportButton onClick={handleToggleModal} />
        </div>
        <button style={{ marginLeft: 20 }} onClick={handleLogout}>
          Cerrar Sesion
        </button>

        {isModalVisible && (
          <div
            className="modal"
            style={{
              width: '80%',
              maxWidth: 400,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#fff',
              padding: '10px',
              borderRadius: '16px',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10
            }}
          >
          <h3>Reportar Incidente</h3>
           <label style={styles.label}>
             Tipo
             <select style={{width: 303, borderWidth: 0, borderBottomWidth: 1}}value={incidentData.type} onChange={handleTypeChange}>
               <option value="Accidente">Accidente</option>
               <option value="Hurto">Hurto</option>
               <option value="Homicidio">Homicidio</option>
             </select>
           </label>
           <label style={styles.label}>
             Descripción
             <textarea
             style={{width: 303, height: 102, backgroundColor: '#F0EDED', borderRadius: 10, borderWidth: 0, color: '#212121'}}
               value={incidentData.description}
               onChange={handleDescriptionChange}
             />
           </label>
          
           <button style={styles.button} onClick={handleReportIncident}>Crear Reporte</button>
          </div>
        )}

{selectedIncidencia && (
  <div  className="modal"
  style={{
    width: '80%',
    maxWidth: 400,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '16px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

  }}>
     <button style={styles.closeButton} onClick={handleCloseModal}>X</button>
     <h3>{getLocationName(selectedIncidencia.UbicacionID)}</h3>
    <p style={{color: '#212121', fontWeight: "500"}}>Descripcion: {selectedIncidencia.Descripcion}</p>
    <p style={{color: '#212121', fontWeight: "500"}}>Tipo: {selectedIncidencia.Tipo}</p>
    <p style={{color: '#212121', fontWeight: "500"}}>Esta zona ha sido reportada como peligrosa, te recomendamos precaucion </p>
  </div>
)}
      </div>
      <div ref={mapContainerRef} style={{ width: "100%", height: "80vh" }} />
    </div>
  );
};

const styles = {
  label: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 15
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
    width: "153px",
    height: "41px",
    backgroundColor: "#FF5858",
    color: "#ffffff",
    marginTop: '2vh',
    alignSelf: 'center'
  },
  closeButton: {
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
    width: "53px",
    height: "41px",
    backgroundColor: "#FF5858",
    color: "#ffffff",
    marginTop: '2vh',
    alignSelf: 'flex-start'
  },
}

export default HomePage;
