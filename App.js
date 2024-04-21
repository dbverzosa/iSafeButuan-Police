// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Button, Linking, FlatList } from 'react-native';
// import * as Location from 'expo-location';
// import firebase from '@react-native-firebase/app';
// import '@react-native-firebase/firestore';

// const App = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [emergencies, setEmergencies] = useState([]);

//   useEffect(() => {
//     getLocationPermission();
//   }, []);

//   const getLocationPermission = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       console.log('Permission to access location was denied');
//     }
//   };

//   const getCurrentLocation = async () => {
//     try {
//       const location = await Location.getCurrentPositionAsync({});
//       setCurrentLocation(location);
//     } catch (error) {
//       console.error('Error getting current location:', error);
//     }
//   };

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of the Earth in kilometers
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//       0.5 -
//       Math.cos(dLat) / 2 +
//       (Math.cos(lat1 * (Math.PI / 180)) *
//         Math.cos(lat2 * (Math.PI / 180)) *
//         (1 - Math.cos(dLon))) /
//         2;
//     return R * 2 * Math.asin(Math.sqrt(a));
//   };

//   const getEmergencies = async () => {
//     const snapshot = await firebase.firestore().collection('emergencies').get();
//     const emergencies = [];

//     snapshot.forEach(doc => {
//       const locationData = doc.data();
//       const distance = calculateDistance(
//         currentLocation.coords.latitude,
//         currentLocation.coords.longitude,
//         locationData.latitude,
//         locationData.longitude
//       );
//       emergencies.push({ ...locationData, distance });
//     });

//     setEmergencies(emergencies);
//   };

//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   useEffect(() => {
//     if (currentLocation) {
//       getEmergencies();
//     }
//   }, [currentLocation]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>CITIZEN'S WHO NEEDS HELP</Text>
//       {/* <Button title="Get Current Location" onPress={getCurrentLocation} /> */}
//       <FlatList
//         data={emergencies}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View>
//             <Text>Latitude: {item.latitude}, Longitude: {item.longitude}</Text>
//             <Text>Distance: {item.distance.toFixed(2)} km</Text>
//             <Button
//               title="View Route"
//               onPress={() =>
//                 Linking.openURL(
//                   `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&destination=${item.latitude},${item.longitude}`
//                 )
//               }
//             />
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   heading: {

//     fontSize:20,
//     marginTop: 500,
//   }
// });

// export default App;






//////working already
// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Button, Linking, FlatList, TouchableOpacity } from 'react-native';
// import * as Location from 'expo-location';
// import firebase from '@react-native-firebase/app';
// import '@react-native-firebase/firestore';

// const App = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [emergencies, setEmergencies] = useState([]);
//   const [remainingTime, setRemainingTime] = useState(null);

//   useEffect(() => {
//     getLocationPermission();
//   }, []);

//   const getLocationPermission = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       console.log('Permission to access location was denied');
//     }
//   };

//   const getCurrentLocation = async () => {
//     try {
//       const location = await Location.getCurrentPositionAsync({});
//       setCurrentLocation(location);
//     } catch (error) {
//       console.error('Error getting current location:', error);
//     }
//   };

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of the Earth in kilometers
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//       0.5 -
//       Math.cos(dLat) / 2 +
//       (Math.cos(lat1 * (Math.PI / 180)) *
//         Math.cos(lat2 * (Math.PI / 180)) *
//         (1 - Math.cos(dLon))) /
//         2;
//     return R * 2 * Math.asin(Math.sqrt(a));
//   };

//   const getEmergencies = async () => {
//     const snapshot = await firebase.firestore().collection('emergencies').get();
//     const emergencies = [];

//     snapshot.forEach(doc => {
//       const locationData = doc.data();
//       const distance = calculateDistance(
//         currentLocation.coords.latitude,
//         currentLocation.coords.longitude,
//         locationData.latitude,
//         locationData.longitude
//       );
//       emergencies.push({ ...locationData, distance });
//     });

//     setEmergencies(emergencies);
//   };

//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   useEffect(() => {
//     if (currentLocation) {
//       getEmergencies();
//     }
//   }, [currentLocation]);

//   const handleAcceptEmergency = async (emergencyId) => {
//     try {
//       await firebase.firestore().collection('emergencies').doc(emergencyId).update({
//         status: 'responded'
//       });

//       // Start a countdown timer for response time
//       const responseTimeInMinutes = 5; // Adjust as needed
//       const endTime = Date.now() + responseTimeInMinutes * 60 * 1000;

//       const intervalId = setInterval(() => {
//         const remaining = endTime - Date.now();
//         if (remaining <= 0) {
//           setRemainingTime('Time Up!');
//           clearInterval(intervalId);
//         } else {
//           const minutes = Math.floor(remaining / (60 * 1000));
//           const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
//           setRemainingTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
//         }
//       }, 1000);

//       // Refresh the emergencies list
//       getEmergencies();
//     } catch (error) {
//       console.error('Error accepting emergency:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>CITIZEN'S WHO NEEDS HELP</Text>
//       <FlatList
//         data={emergencies}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.itemContainer}>
//             <Text>Latitude: {item.latitude}, Longitude: {item.longitude}</Text>
//             <Text>Distance: {item.distance.toFixed(2)} km</Text>
//             <TouchableOpacity
//               style={styles.acceptButton}
//               onPress={() => handleAcceptEmergency(item.id)}
//             >
//               <Text style={styles.buttonText}>Accept</Text>
//             </TouchableOpacity>
//             <View style={styles.buttonContainer}>
//               <Button
//                 title="View Fastest Route"
//                 onPress={() =>
//                   Linking.openURL(
//                     `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&destination=${item.latitude},${item.longitude}`
//                   )
//                 }
//               />
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   heading: {
//     fontSize: 24,
//     marginTop: 50,
//     marginBottom: 20,
//     fontWeight: 'bold',
//     color: '#841584', 
//   },
  
//   itemContainer: {
//     borderWidth: 2,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 10,
//     width: '90%',
//     alignSelf: 'center',
//   },
//   acceptButton: {
//     backgroundColor: 'green',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     marginTop: 10,
//     marginBottom: 10,
//   },
// });

// export default App;
/////////////////---------prev works-----------////////
// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Button, Linking, FlatList, TouchableOpacity, ScrollView } from 'react-native';
// import * as Location from 'expo-location';
// import firebase from '@react-native-firebase/app';
// import '@react-native-firebase/firestore';

// const App = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [emergencies, setEmergencies] = useState([]);
//   const [acceptedEmergencies, setAcceptedEmergencies] = useState([]);
//   const [buttonColors, setButtonColors] = useState({});

//   useEffect(() => {
//     getLocationPermission();
//   }, []);

//   const getLocationPermission = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       console.log('Permission to access location was denied');
//     }
//   };

//   const getCurrentLocation = async () => {
//     try {
//       const location = await Location.getCurrentPositionAsync({});
//       setCurrentLocation(location);
//     } catch (error) {
//       console.error('Error getting current location:', error);
//     }
//   };

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of the Earth in kilometers
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//       0.5 -
//       Math.cos(dLat) / 2 +
//       (Math.cos(lat1 * (Math.PI / 180)) *
//         Math.cos(lat2 * (Math.PI / 180)) *
//         (1 - Math.cos(dLon))) /
//         2;
//     return R * 2 * Math.asin(Math.sqrt(a));
//   };

//   const getEmergencies = async () => {
//     const snapshot = await firebase.firestore().collection('emergencies').get();
//     const emergencies = [];

//     snapshot.forEach(doc => {
//       const locationData = doc.data();
//       const distance = calculateDistance(
//         currentLocation.coords.latitude,
//         currentLocation.coords.longitude,
//         locationData.latitude,
//         locationData.longitude
//       );
//       emergencies.push({ id: doc.id, ...locationData, distance }); // Include doc.id for identifying each emergency
//     });

//     setEmergencies(emergencies);
//     setButtonColors(emergencies.reduce((acc, cur) => {
//       acc[cur.id] = acceptedEmergencies.includes(cur.id) ? 'red' : 'green';
//       return acc;
//     }, {}));
//   };

//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   useEffect(() => {
//     if (currentLocation) {
//       getEmergencies();
//     }
//   }, [currentLocation]);

//   const handleAcceptEmergency = async (emergencyId) => {
//     try {
//       await firebase.firestore().collection('emergencies').doc(emergencyId).update({
//         status: true
//       });
  
//       // Update the status in the local state
//       setEmergencies(prevEmergencies =>
//         prevEmergencies.map(emergency =>
//           emergency.id === emergencyId ? { ...emergency, status: true } : emergency
//         )
//       );
  
//       // Start a countdown timer for response time...
//     } catch (error) {
//       console.error('Error accepting emergency:', error);
//     }
//   };
  

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>CITIZENS NEED HELP</Text>
//       <FlatList
//         style={styles.flatList}
//         data={emergencies}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.itemContainer}>
//             <Text>Latitude: {item.latitude}, Longitude: {item.longitude}</Text>
//             <Text>Distance: {item.distance.toFixed(2)} km</Text>
//             {item.status ? (
//               <Text style={styles.acceptedText}>Accepted</Text>
//             ) : (
//               <Text style={styles.pendingText}>Pending</Text>
//             )}
//             <TouchableOpacity
//               style={[styles.acceptButton, { backgroundColor: buttonColors[item.id] }]}
//               onPress={() => handleAcceptEmergency(item.id)}
//             >
//               <Text style={styles.buttonText}>Accept</Text>
//             </TouchableOpacity>
//             <View style={styles.buttonContainer}>
//               <Button
//                 title="View Fastest Route"
//                 onPress={() =>
//                   Linking.openURL(
//                     `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&destination=${item.latitude},${item.longitude}`
//                   )
//                 }
//               />
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   heading: {
//     fontSize: 24,
//     marginTop: 50,
//     marginBottom: 20,
//     fontWeight: 'bold',
//     color: '#841584',
//   },
//   itemContainer: {
//     borderWidth: 2,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 10,
//     width: '90%',
//     marginBottom: 10,
//     // alignSelf: 'center', // Remove this line
//   },
//   flatList: {
//     flexGrow: 1, // Allow the FlatList to expand to fill the available space
//   },
//   acceptButton: {
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   acceptedText: {
//     backgroundColor: 'lightgreen',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   pendingText: {
//     backgroundColor: 'yellow',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     marginTop: 10,
//     marginBottom: 10,
//   },
// });

// export default App;




import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Linking, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import Incidents from './Incidents';

const App = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [emergencies, setEmergencies] = useState([]);
  const [acceptedEmergencies, setAcceptedEmergencies] = useState([]);
  const [buttonColors, setButtonColors] = useState({});
  const [showIncidents, setShowIncidents] = useState(false); // State to toggle the Incidents component
  const [timers, setTimers] = useState({}); // State to manage countdown timers

  useEffect(() => {
    getLocationPermission();
  }, []);

  const getLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      0.5 -
      Math.cos(dLat) / 2 +
      (Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        (1 - Math.cos(dLon))) /
        2;
    return R * 2 * Math.asin(Math.sqrt(a));
  };

  const getEmergencies = async () => {
    const snapshot = await firebase.firestore().collection('emergencies').get();
    const emergencies = [];

    snapshot.forEach(doc => {
      const locationData = doc.data();
      const distance = calculateDistance(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        locationData.latitude,
        locationData.longitude
      );
      emergencies.push({ id: doc.id, ...locationData, distance }); // Include doc.id for identifying each emergency
    });

    setEmergencies(emergencies);
    setButtonColors(emergencies.reduce((acc, cur) => {
      acc[cur.id] = acceptedEmergencies.includes(cur.id) ? 'green' : 'red';
      return acc;
    }, {}));
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      getEmergencies();
    }
  }, [currentLocation]);

  const handleAcceptEmergency = async (emergencyId) => {
    try {
      await firebase.firestore().collection('emergencies').doc(emergencyId).update({
        status: 'Accepted'
      });
  
      // Update the status in the local state
      setEmergencies(prevEmergencies =>
        prevEmergencies.map(emergency =>
          emergency.id === emergencyId ? { ...emergency, status: 'Accepted' } : emergency
        )
      );
  
      // Update button color to green
      setButtonColors(prevButtonColors => ({
        ...prevButtonColors,
        [emergencyId]: 'green'
      }));
  
      // Start a countdown timer to remove the emergency
      const timer = setTimeout(() => {
        setEmergencies(prevEmergencies =>
          prevEmergencies.filter(emergency => emergency.id !== emergencyId)
        );
        // Clear the timer
        clearTimeout(timers[emergencyId]);
      }, 60 * 1000); // 1 minute in milliseconds
  
      // Save the timer to clear it later if needed
      setTimers(prevTimers => ({
        ...prevTimers,
        [emergencyId]: timer
      }));
    } catch (error) {
      console.error('Error accepting emergency:', error);
    }
  };
  
  
  
  
  // In your useEffect for cleanup, clear the timers
  useEffect(() => {
    return () => {
      Object.values(timers).forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
          <View style={styles.container}>
            <Text style={styles.heading}>CITIZENS NEED HELP</Text>
            <View style={styles.flatListContainer}>
            <FlatList
        style={styles.flatList}
        data={emergencies.filter(emergency => emergency.status !== 'Accepted')}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>Latitude: {item.latitude}, Longitude: {item.longitude}</Text>
            <Text>Distance: {item.distance.toFixed(2)} km</Text>
            {item.status ? (
              <Text style={styles.acceptedText}>Accepted</Text>
            ) : (
              <Text style={styles.pendingText}>Pending</Text>
            )}
            {timers[item.id] && (
              <Text style={styles.timerText}>
                Timer: {Math.ceil((timers[item.id] - Date.now()) / 1000)} seconds
              </Text>
            )}
            <TouchableOpacity
              style={[styles.acceptButton, { backgroundColor: buttonColors[item.id] }]}
              onPress={() => handleAcceptEmergency(item.id)}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <Button
                title="View Fastest Route"
                onPress={() =>
                  Linking.openURL(
                    `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&destination=${item.latitude},${item.longitude}`
                  )
                }
              />
            </View>
          </View>
        )}
      />

      </View>
      {showIncidents && <Incidents onClose={() => setShowIncidents(false)} />}
        <View style={styles.buttonContainer}>
          <Button
            title="Show Incidents"
            onPress={() => setShowIncidents(true)}
          />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    marginTop: 50,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#841584',
  },
  flatListContainer: {
    flex: 1, // Allow the FlatList container to expand to fill the available space
    width: '100%', // Ensure the container takes up the full width
  },
  itemContainer: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '90%',
    marginBottom: 10,
    alignSelf: 'center', // Center the item horizontally
  },
  flatList: {
    flexGrow: 1, // Allow the FlatList to expand to fill the available space
  },
  acceptButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  acceptedText: {
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  pendingText: {
    backgroundColor: 'yellow',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default App;










////-----------------WORKING LAST-------------
// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Button, Linking, FlatList, TouchableOpacity, ScrollView } from 'react-native';
// import * as Location from 'expo-location';
// import firebase from '@react-native-firebase/app';
// import '@react-native-firebase/firestore';
// import Incidents from './Incidents';

// const App = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [emergencies, setEmergencies] = useState([]);
//   const [acceptedEmergencies, setAcceptedEmergencies] = useState([]);
//   const [buttonColors, setButtonColors] = useState({});
//   const [showIncidents, setShowIncidents] = useState(false); // State to toggle the Incidents component
//   const [timers, setTimers] = useState({}); // State to manage countdown timers

//   useEffect(() => {
//     getLocationPermission();
//   }, []);

//   const getLocationPermission = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       console.log('Permission to access location was denied');
//     }
//   };

//   const getCurrentLocation = async () => {
//     try {
//       const location = await Location.getCurrentPositionAsync({});
//       setCurrentLocation(location);
//     } catch (error) {
//       console.error('Error getting current location:', error);
//     }
//   };

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of the Earth in kilometers
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//       0.5 -
//       Math.cos(dLat) / 2 +
//       (Math.cos(lat1 * (Math.PI / 180)) *
//         Math.cos(lat2 * (Math.PI / 180)) *
//         (1 - Math.cos(dLon))) /
//         2;
//     return R * 2 * Math.asin(Math.sqrt(a));
//   };

//   const getEmergencies = async () => {
//     const snapshot = await firebase.firestore().collection('emergencies').get();
//     const emergencies = [];

//     snapshot.forEach(doc => {
//       const locationData = doc.data();
//       const distance = calculateDistance(
//         currentLocation.coords.latitude,
//         currentLocation.coords.longitude,
//         locationData.latitude,
//         locationData.longitude
//       );
//       emergencies.push({ id: doc.id, ...locationData, distance }); // Include doc.id for identifying each emergency
//     });

//     setEmergencies(emergencies);
//     setButtonColors(emergencies.reduce((acc, cur) => {
//       acc[cur.id] = acceptedEmergencies.includes(cur.id) ? 'green' : 'red';
//       return acc;
//     }, {}));
//   };

//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   useEffect(() => {
//     if (currentLocation) {
//       getEmergencies();
//     }
//   }, [currentLocation]);

//   const handleAcceptEmergency = async (emergencyId) => {
//     try {
//       await firebase.firestore().collection('emergencies').doc(emergencyId).update({
//         status: 'Accepted'
//       });
  
//       // Update the status in the local state
//       setEmergencies(prevEmergencies =>
//         prevEmergencies.map(emergency =>
//           emergency.id === emergencyId ? { ...emergency, status: 'Accepted' } : emergency
//         )
//       );
  
//       // Update button color to green
//       setButtonColors(prevButtonColors => ({
//         ...prevButtonColors,
//         [emergencyId]: 'green'
//       }));
  
//       // Start a countdown timer to remove the emergency
//       const timer = setTimeout(() => {
//         setEmergencies(prevEmergencies =>
//           prevEmergencies.filter(emergency => emergency.id !== emergencyId)
//         );
//         // Clear the timer
//         clearTimeout(timers[emergencyId]);
//       }, 60 * 1000); // 1 minute in milliseconds
  
//       // Save the timer to clear it later if needed
//       setTimers(prevTimers => ({
//         ...prevTimers,
//         [emergencyId]: timer
//       }));
//     } catch (error) {
//       console.error('Error accepting emergency:', error);
//     }
//   };
  
  
  
  
//   // In your useEffect for cleanup, clear the timers
//   useEffect(() => {
//     return () => {
//       Object.values(timers).forEach(timer => clearTimeout(timer));
//     };
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>CITIZENS NEED HELP</Text>
//       <View style={styles.flatListContainer}>
//         <FlatList
//           style={styles.flatList}
//           // data={emergencies.filter(emergency => !emergency.status)} 
//           data={emergencies} 
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.itemContainer}>
//   <Text>Latitude: {item.latitude}, Longitude: {item.longitude}</Text>
//   <Text>Distance: {item.distance.toFixed(2)} km</Text>
//   {item.status ? (
//     <Text style={styles.acceptedText}>Accepted</Text>
//   ) : (
//     <Text style={styles.pendingText}>Pending</Text>
//   )}
//   {timers[item.id] && (
//     <Text style={styles.timerText}>
//       Timer: {Math.ceil((timers[item.id] - Date.now()) / 1000)} seconds
//     </Text>
//   )}
//   <TouchableOpacity
//     style={[styles.acceptButton, { backgroundColor: buttonColors[item.id] }]}
//     onPress={() => handleAcceptEmergency(item.id)}
//   >
//     <Text style={styles.buttonText}>Accept</Text>
//   </TouchableOpacity>
//   <View style={styles.buttonContainer}>
//     <Button
//       title="View Fastest Route"
//       onPress={() =>
//         Linking.openURL(
//           `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&destination=${item.latitude},${item.longitude}`
//         )
//       }
//     />
//   </View>
// </View>
//           )}
//         />
//       </View>
//       {showIncidents && <Incidents onClose={() => setShowIncidents(false)} />}
//         <View style={styles.buttonContainer}>
//           <Button
//             title="Show Incidents"
//             onPress={() => setShowIncidents(true)}
//           />
//         </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   heading: {
//     fontSize: 24,
//     marginTop: 50,
//     marginBottom: 20,
//     fontWeight: 'bold',
//     color: '#841584',
//   },
//   flatListContainer: {
//     flex: 1, // Allow the FlatList container to expand to fill the available space
//     width: '100%', // Ensure the container takes up the full width
//   },
//   itemContainer: {
//     borderWidth: 2,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 10,
//     width: '90%',
//     marginBottom: 10,
//     alignSelf: 'center', // Center the item horizontally
//   },
//   flatList: {
//     flexGrow: 1, // Allow the FlatList to expand to fill the available space
//   },
//   acceptButton: {
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   acceptedText: {
//     backgroundColor: 'lightgreen',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   pendingText: {
//     backgroundColor: 'yellow',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     marginTop: 10,
//     marginBottom: 10,
//   },
// });

// export default App;

////-----------------WORKING LAST-------------













//////the prev- WORK BEST THAN EVER-----------------/////////////

// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Button, Linking, FlatList, TouchableOpacity, ScrollView } from 'react-native';
// import * as Location from 'expo-location';
// import firebase from '@react-native-firebase/app';
// import '@react-native-firebase/firestore';

// const App = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [emergencies, setEmergencies] = useState([]);
//   const [acceptedEmergencies, setAcceptedEmergencies] = useState([]);
//   const [buttonColors, setButtonColors] = useState({});

//   useEffect(() => {
//     getLocationPermission();
//   }, []);

//   const getLocationPermission = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       console.log('Permission to access location was denied');
//     }
//   };

//   const getCurrentLocation = async () => {
//     try {
//       const location = await Location.getCurrentPositionAsync({});
//       setCurrentLocation(location);
//     } catch (error) {
//       console.error('Error getting current location:', error);
//     }
//   };

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of the Earth in kilometers
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//       0.5 -
//       Math.cos(dLat) / 2 +
//       (Math.cos(lat1 * (Math.PI / 180)) *
//         Math.cos(lat2 * (Math.PI / 180)) *
//         (1 - Math.cos(dLon))) /
//         2;
//     return R * 2 * Math.asin(Math.sqrt(a));
//   };

//   const getEmergencies = async () => {
//     const snapshot = await firebase.firestore().collection('emergencies').get();
//     const emergencies = [];

//     snapshot.forEach(doc => {
//       const locationData = doc.data();
//       const distance = calculateDistance(
//         currentLocation.coords.latitude,
//         currentLocation.coords.longitude,
//         locationData.latitude,
//         locationData.longitude
//       );
//       emergencies.push({ id: doc.id, ...locationData, distance }); // Include doc.id for identifying each emergency
//     });

//     setEmergencies(emergencies);
//     setButtonColors(emergencies.reduce((acc, cur) => {
//       acc[cur.id] = acceptedEmergencies.includes(cur.id) ? 'red' : 'green';
//       return acc;
//     }, {}));
//   };

//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   useEffect(() => {
//     if (currentLocation) {
//       getEmergencies();
//     }
//   }, [currentLocation]);

//   const handleAcceptEmergency = async (emergencyId) => {
//     try {
//       await firebase.firestore().collection('emergencies').doc(emergencyId).update({
//         status: true
//       });
  
//       // Update the status in the local state
//       setEmergencies(prevEmergencies =>
//         prevEmergencies.map(emergency =>
//           emergency.id === emergencyId ? { ...emergency, status: true } : emergency
//         )
//       );
  
//       // Start a countdown timer for response time...
//     } catch (error) {
//       console.error('Error accepting emergency:', error);
//     }
//   };
  

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>CITIZENS NEED HELP</Text>
//       <View style={styles.flatListContainer}>
//         <FlatList
//           style={styles.flatList}
//           data={emergencies}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.itemContainer}>
//               <Text>Latitude: {item.latitude}, Longitude: {item.longitude}</Text>
//               <Text>Distance: {item.distance.toFixed(2)} km</Text>
//               {item.status ? (
//                 <Text style={styles.acceptedText}>Accepted</Text>
//               ) : (
//                 <Text style={styles.pendingText}>Pending</Text>
//               )}
//               <TouchableOpacity
//                 style={[styles.acceptButton, { backgroundColor: buttonColors[item.id] }]}
//                 onPress={() => handleAcceptEmergency(item.id)}
//               >
//                 <Text style={styles.buttonText}>Accept</Text>
//               </TouchableOpacity>
//               <View style={styles.buttonContainer}>
//                 <Button
//                   title="View Fastest Route"
//                   onPress={() =>
//                     Linking.openURL(
//                       `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&destination=${item.latitude},${item.longitude}`
//                     )
//                   }
//                 />
//               </View>
//             </View>
//           )}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   heading: {
//     fontSize: 24,
//     marginTop: 50,
//     marginBottom: 20,
//     fontWeight: 'bold',
//     color: '#841584',
//   },
//   flatListContainer: {
//     flex: 1, // Allow the FlatList container to expand to fill the available space
//     width: '100%', // Ensure the container takes up the full width
//   },
//   itemContainer: {
//     borderWidth: 2,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 10,
//     width: '90%',
//     marginBottom: 10,
//     alignSelf: 'center', // Center the item horizontally
//   },
//   flatList: {
//     flexGrow: 1, // Allow the FlatList to expand to fill the available space
//   },
//   acceptButton: {
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   acceptedText: {
//     backgroundColor: 'lightgreen',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   pendingText: {
//     backgroundColor: 'yellow',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     marginTop: 10,
//     marginBottom: 10,
//   },
// });

// export default App;












































//////-------------------------WORKING ALREADY BEST------------///////////
// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Button, Linking, FlatList, TouchableOpacity } from 'react-native';
// import * as Location from 'expo-location';
// import firebase from '@react-native-firebase/app';
// import '@react-native-firebase/firestore';

// const App = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [emergencies, setEmergencies] = useState([]);
//   const [acceptedEmergencies, setAcceptedEmergencies] = useState([]);
//   const [buttonColors, setButtonColors] = useState({});

//   useEffect(() => {
//     getLocationPermission();
//   }, []);

//   const getLocationPermission = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       console.log('Permission to access location was denied');
//     }
//   };

//   const getCurrentLocation = async () => {
//     try {
//       const location = await Location.getCurrentPositionAsync({});
//       setCurrentLocation(location);
//     } catch (error) {
//       console.error('Error getting current location:', error);
//     }
//   };

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of the Earth in kilometers
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//       0.5 -
//       Math.cos(dLat) / 2 +
//       (Math.cos(lat1 * (Math.PI / 180)) *
//         Math.cos(lat2 * (Math.PI / 180)) *
//         (1 - Math.cos(dLon))) /
//         2;
//     return R * 2 * Math.asin(Math.sqrt(a));
//   };

//   const getEmergencies = async () => {
//     const snapshot = await firebase.firestore().collection('emergencies').get();
//     const emergencies = [];

//     snapshot.forEach(doc => {
//       const locationData = doc.data();
//       const distance = calculateDistance(
//         currentLocation.coords.latitude,
//         currentLocation.coords.longitude,
//         locationData.latitude,
//         locationData.longitude
//       );
//       emergencies.push({ id: doc.id, ...locationData, distance }); // Include doc.id for identifying each emergency
//     });

//     setEmergencies(emergencies);
//     setButtonColors(emergencies.reduce((acc, cur) => {
//       acc[cur.id] = acceptedEmergencies.includes(cur.id) ? 'red' : 'green';
//       return acc;
//     }, {}));
//   };

//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   useEffect(() => {
//     if (currentLocation) {
//       getEmergencies();
//     }
//   }, [currentLocation]);

//   const handleAcceptEmergency = async (emergencyId) => {
//     try {
//       await firebase.firestore().collection('emergencies').doc(emergencyId).update({
//         status: true
//       });
  
//       // Update the status in the local state
//       setEmergencies(prevEmergencies =>
//         prevEmergencies.map(emergency =>
//           emergency.id === emergencyId ? { ...emergency, status: true } : emergency
//         )
//       );
  
//       // Start a countdown timer for response time...
//     } catch (error) {
//       console.error('Error accepting emergency:', error);
//     }
//   };
  

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>CITIZENS NEED HELP</Text>
//       <FlatList
//         data={emergencies}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.itemContainer}>
//             <Text>Latitude: {item.latitude}, Longitude: {item.longitude}</Text>
//             <Text>Distance: {item.distance.toFixed(2)} km</Text>
//             {item.status ? (
//               <Text style={styles.acceptedText}>Accepted</Text>
//             ) : (
//               <Text style={styles.pendingText}>Pending</Text>
//             )}
//             <TouchableOpacity
//               style={[styles.acceptButton, { backgroundColor: buttonColors[item.id] }]}
//               onPress={() => handleAcceptEmergency(item.id)}
//             >
//               <Text style={styles.buttonText}>Accept</Text>
//             </TouchableOpacity>
//             <View style={styles.buttonContainer}>
//               <Button
//                 title="View Fastest Route"
//                 onPress={() =>
//                   Linking.openURL(
//                     `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&destination=${item.latitude},${item.longitude}`
//                   )
//                 }
//               />
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   heading: {
//     fontSize: 24,
//     marginTop: 50,
//     marginBottom: 20,
//     fontWeight: 'bold',
//     color: '#841584',
//   },
//   itemContainer: {
//     borderWidth: 2,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 10,
//     width: '90%',
//     alignSelf: 'center',
//   },
//   acceptButton: {
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   acceptedText: {
//     backgroundColor: 'lightgreen',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   pendingText: {
//     backgroundColor: 'yellow',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     marginTop: 10,
//     marginBottom: 10,
//   },
// });

// export default App;







// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Button, Linking, FlatList, TouchableOpacity } from 'react-native';
// import * as Location from 'expo-location';
// import firebase from '@react-native-firebase/app';
// import '@react-native-firebase/firestore';

// const App = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [emergencies, setEmergencies] = useState([]);
//   const [remainingTime, setRemainingTime] = useState(null);
//   const [acceptedEmergencies, setAcceptedEmergencies] = useState([]);

//   useEffect(() => {
//     getLocationPermission();
//   }, []);

//   const getLocationPermission = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       console.log('Permission to access location was denied');
//     }
//   };

//   const getCurrentLocation = async () => {
//     try {
//       const location = await Location.getCurrentPositionAsync({});
//       setCurrentLocation(location);
//     } catch (error) {
//       console.error('Error getting current location:', error);
//     }
//   };

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of the Earth in kilometers
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//       0.5 -
//       Math.cos(dLat) / 2 +
//       (Math.cos(lat1 * (Math.PI / 180)) *
//         Math.cos(lat2 * (Math.PI / 180)) *
//         (1 - Math.cos(dLon))) /
//         2;
//     return R * 2 * Math.asin(Math.sqrt(a));
//   };

//   const getEmergencies = async () => {
//     const snapshot = await firebase.firestore().collection('emergencies').get();
//     const emergencies = [];

//     snapshot.forEach(doc => {
//       const locationData = doc.data();
//       const distance = calculateDistance(
//         currentLocation.coords.latitude,
//         currentLocation.coords.longitude,
//         locationData.latitude,
//         locationData.longitude
//       );
//       emergencies.push({ ...locationData, distance });
//     });

//     setEmergencies(emergencies);
//   };

//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   useEffect(() => {
//     if (currentLocation) {
//       getEmergencies();
//     }
//   }, [currentLocation]);

//   const handleAcceptEmergency = async (emergencyId) => {
//     try {
//       await firebase.firestore().collection('emergencies').doc(emergencyId).update({
//         status: 'responded'
//       });

//       setAcceptedEmergencies([...acceptedEmergencies, emergencyId]);

//       // Start a countdown timer for response time...
//     } catch (error) {
//       console.error('Error accepting emergency:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>CITIZENS NEED HELP</Text>
//       <FlatList
//         data={emergencies}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.itemContainer}>
//             <Text>Latitude: {item.latitude}, Longitude: {item.longitude}</Text>
//             <Text>Distance: {item.distance.toFixed(2)} km</Text>
//             {acceptedEmergencies.includes(item.id) ? (
//               <Text style={styles.acceptedText}>Accepted</Text>
//             ) : (
//               <TouchableOpacity
//                 style={styles.acceptButton}
//                 onPress={() => handleAcceptEmergency(item.id)}
//               >
//                 <Text style={styles.buttonText}>Accept</Text>
//               </TouchableOpacity>
//             )}
//             <View style={styles.buttonContainer}>
//               <Button
//                 title="View Fastest Route"
//                 onPress={() =>
//                   Linking.openURL(
//                     `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&destination=${item.latitude},${item.longitude}`
//                   )
//                 }
//               />
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   heading: {
//     fontSize: 24,
//     marginTop: 50,
//     marginBottom: 20,
//     fontWeight: 'bold',
//     color: '#841584',
//   },
//   itemContainer: {
//     borderWidth: 2,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 10,
//     width: '90%',
//     alignSelf: 'center',
//   },
//   acceptButton: {
//     backgroundColor: 'green',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   acceptedText: {
//     backgroundColor: 'lightgreen',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     marginTop: 10,
//     marginBottom: 10,
//   },
// });

// export default App;
