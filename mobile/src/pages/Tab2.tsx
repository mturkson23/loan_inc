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
      baseURL: `http://127.0.0.1:8000`,  
    });
    api.get("/transactions")
    .then((res) => {
      const data = res?.data;
      console.log(data)
      if(data?.data?.length > 0){
        setTransactions(data.data);
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
          <IonTitle>Collections</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {transactions && transactions.map((collection: any) =>
          <IonCard key={collection.id}>
            <IonCardHeader>
              <IonCardSubtitle>
              {new Intl.DateTimeFormat("en-GB", {
                year: "numeric",
                month: "long",
                day: "2-digit"
              }).format(Date.parse(collection.transactionDate))}                
              </IonCardSubtitle>
              <p><b>Customer:</b> {collection.customerName}</p>
              <p><b>Amount:</b> {collection.amountPaid}</p>
            </IonCardHeader>
          </IonCard>
          )} 
        </IonList>         
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
