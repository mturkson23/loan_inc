import React, {useState, useEffect} from 'react';
import { IonToast, IonContent, 
  // IonBadge, IonLabel, IonItem, 
  IonList, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, 
  // IonCardContent, 
  IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/react';
// import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

import { useHistory } from "react-router";

// import Tab1Detail from './Tab1Detail';
import axios from 'axios';
const Tab1: React.FC = () => {
  const history = useHistory();
  const [toastState, setToastState] = useState(false);
  const [customers, setCustomer] = useState([]);  
  const [toastMessage, setToastMessage] = useState("");
  const loadCustomer = () => {
    const api = axios.create({
      baseURL: `http://localhost:8001`,
    });

    // const postData = {};
    
    api.get("/customers")
    .then((res) => {

      const data = res?.data;
      if(data.data){
        setCustomer(data.data);
      }
    })
    .catch((error) => {
      setToastMessage("Failed to load data over network");
      console.log(error);
      setToastState(true);
    });
  }

  useEffect(() => {
    loadCustomer();
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Customers</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <span className="empty-space-2"></span>
        <IonList>
          {/* <IonItem>
            <IonLabel>Total Collections</IonLabel>
            <IonBadge slot="end">22</IonBadge>
          </IonItem> */}
          {customers && customers.map((customer: any) =>
          <IonCard key={customer.id}>
            <IonCardHeader>
              <IonCardSubtitle>{customer.customer_no}</IonCardSubtitle>
              <IonCardTitle>
              <a onClick={() => history.push("/tabs/tab1-detail", {'customer': customer})}>
                <h3>{customer.first_name} {customer.surname}</h3>
              </a>
              </IonCardTitle>
            </IonCardHeader>
          </IonCard>
          )} 
        </IonList> 
        <IonToast
          isOpen={toastState}
          onDidDismiss={() => setToastState(false)}
          message={toastMessage}
          duration={4000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
