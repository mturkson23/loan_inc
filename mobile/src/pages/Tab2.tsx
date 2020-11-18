import React, {useState, useEffect} from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonList, IonCard, IonCardHeader, IonCardSubtitle, 
  // IonCardTitle
 } from '@ionic/react';
import './Tab2.css';

import axios from 'axios';
import {Plugins} from "@capacitor/core";
const {Storage} = Plugins;

const getItem = async (key: string, stateUpdateHook: any)=> {
  const { value } = await Storage.get({ key: key });
  stateUpdateHook(value);
}

const Tab2: React.FC = () => {
  const [transactions, setTransactions] = useState([]);
  const [deviceToken, setDeviceToken] = useState("");
  getItem('device_token', setDeviceToken);

  const loadTransactions =()=> {
    const api = axios.create({
      baseURL: `http://localhost:8001`,  
    });
    api.get("/transactions/"+deviceToken)
    .then((res) => {
      const data = res?.data;
      if(data?.length > 0){
        setTransactions(data);
      }
    })
    .catch((error) => {
      console.log(error)
    });
  }

  useEffect(() => {
    // if the component is mounted
    loadTransactions();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Collections</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {/* <IonItem>
            <IonLabel>Total Collections</IonLabel>
            <IonBadge slot="end">22</IonBadge>
          </IonItem> */}
          {transactions && transactions.map((collection: any) =>
          <IonCard key={collection.id}>
            <IonCardHeader>
              <IonCardSubtitle>{collection.date_paid}</IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
          )} 
        </IonList>         
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
