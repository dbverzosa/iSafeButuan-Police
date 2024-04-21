import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const Incidents = ({ onClose }) => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const db = firebase.firestore();
        const snapshot = await db.collection('incidents')
          .where('location', '==', '1') // Use '1' if location is stored as a string
          .where('report', '==', true)
          .get();
  
        const incidentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setIncidents(incidentsData);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      }
    };
  
    fetchIncidents();
  }, []);

  const handleAcceptUniformed = async (incidentId) => {
    try {
      const db = firebase.firestore();
      await db.collection('incidents').doc(incidentId).update({
        acceptUniformed: true,
      });
      // Update the local state to reflect the change
      setIncidents(prevIncidents => {
        return prevIncidents.map(incident => {
          if (incident.id === incidentId) {
            return { ...incident, acceptUniformed: true };
          } else {
            return incident;
          }
        });
      });
      // Check if either flag (acceptUniformed or acceptPlainClothes) is true, then update status
      const updatedIncident = incidents.find(incident => incident.id === incidentId);
      if (updatedIncident.acceptPlainClothes || updatedIncident.acceptUniformed) {
        await db.collection('incidents').doc(incidentId).update({
          status: 'Responded',
        });
        setIncidents(prevIncidents => {
          return prevIncidents.map(incident => {
            if (incident.id === incidentId) {
              return { ...incident, status: 'Responded' };
            } else {
              return incident;
            }
          });
        });
      }
    } catch (error) {
      console.error('Error accepting incident as uniformed:', error);
    }
  };
  
  const handleAcceptPlainClothes = async (incidentId) => {
    try {
      const db = firebase.firestore();
      await db.collection('incidents').doc(incidentId).update({
        acceptPlainClothes: true,
      });
      // Update the local state to reflect the change
      setIncidents(prevIncidents => {
        return prevIncidents.map(incident => {
          if (incident.id === incidentId) {
            return { ...incident, acceptPlainClothes: true };
          } else {
            return incident;
          }
        });
      });
      // Check if either flag (acceptUniformed or acceptPlainClothes) is true, then update status
      const updatedIncident = incidents.find(incident => incident.id === incidentId);
      if (updatedIncident.acceptPlainClothes || updatedIncident.acceptUniformed) {
        await db.collection('incidents').doc(incidentId).update({
          status: 'Responded',
        });
        setIncidents(prevIncidents => {
          return prevIncidents.map(incident => {
            if (incident.id === incidentId) {
              return { ...incident, status: 'Responded' };
            } else {
              return incident;
            }
          });
        });
      }
    } catch (error) {
      console.error('Error accepting incident as plain clothes:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Incidents</Text>
      <View style={styles.incidentsContainer}>
        {incidents.map(incident => (
          <View key={incident.id} style={styles.incident}>
            <Text>Incident: {incident.incident}</Text>
            <Text>Location Details: {incident.locationDetails}</Text>
            <Text>Status: {incident.status}</Text>
            <Text>Timestamp: {incident.timestamp && incident.timestamp.toDate().toString()}</Text>
            {incident.uniformed && incident.plainClothes ? (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.acceptButton, incident.acceptUniformed && styles.acceptedButton]}
                  onPress={() => handleAcceptUniformed(incident.id)}
                >
                  <Text style={styles.buttonText}>Accept as Uniformed</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.acceptButton, incident.acceptPlainClothes && styles.acceptedButton]}
                  onPress={() => handleAcceptPlainClothes(incident.id)}
                >
                  <Text style={styles.buttonText}>Accept as Plain Clothes</Text>
                </TouchableOpacity>

              </View>
            ) : incident.uniformed && !incident.plainclothes ? (
              <TouchableOpacity style={styles.acceptButton} onPress={() => handleAcceptUniformed(incident.id)}>
                <Text style={styles.buttonText}>Accept as Uniformed</Text>
              </TouchableOpacity>
            ) : !incident.uniformed && incident.plainclothes ? (
              <TouchableOpacity style={styles.acceptButton} onPress={() => handleAcceptPlainClothes(incident.id)}>
                <Text style={styles.buttonText}>Accept as Plain Clothes</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  incidentsContainer: {
    width: '90%',
  },
  incident: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  acceptButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: 'red',
    alignItems: 'center',
  },
  acceptedButton: {
    backgroundColor: 'green',
  },
  
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Incidents;
