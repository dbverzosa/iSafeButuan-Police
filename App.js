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


import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Linking, FlatList, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const App = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [emergencies, setEmergencies] = useState([]);
  const [remainingTime, setRemainingTime] = useState(null);
  const [acceptedEmergencies, setAcceptedEmergencies] = useState([]);

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
      emergencies.push({ ...locationData, distance });
    });

    setEmergencies(emergencies);
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
        status: 'responded'
      });

      setAcceptedEmergencies([...acceptedEmergencies, emergencyId]);

      // Start a countdown timer for response time...
    } catch (error) {
      console.error('Error accepting emergency:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>CITIZENS NEED HELP</Text>
      <FlatList
        data={emergencies}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>Latitude: {item.latitude}, Longitude: {item.longitude}</Text>
            <Text>Distance: {item.distance.toFixed(2)} km</Text>
            {acceptedEmergencies.includes(item.id) ? (
              <Text style={styles.acceptedText}>Accepted</Text>
            ) : (
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAcceptEmergency(item.id)}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
            )}
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
  itemContainer: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
  },
  acceptButton: {
    backgroundColor: 'green',
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
    alignItems: 'center',
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
