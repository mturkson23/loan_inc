import React, {useState, useEffect} from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonPage,
  IonItemDivider,
  IonItem,
  IonInput,
  IonLabel,
  IonToast, IonCard, IonCardHeader, IonCardTitle, IonBadge
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import './Tab1.css';
import axios from 'axios';

interface LocationState {
    customer: {
        id: number
        first_name: string,
        surname: string,
        phone: string,
        city: string,
        region: string,
    };
  }

const Tab1Detail: React.FC<any> = (props) => {
    const location = useLocation<LocationState>();
    // const customer = props.location.state.customer;
    const params = location.state;
    const [loans, setLoans] = useState([]);
    const [toastMessage, setToastMessage] = useState("");
    const [toastState, setToastState] = useState(false);

    const loadLoans = () => {
        const api = axios.create({
            baseURL: `http://127.0.0.1:8000`,
        });

        // const postData = {};
        const customerId = '/'+params?.customer?.id;
        api.get("/loans" + customerId)
        .then((res) => {
            const data = res?.data;
            if(data.data){
                setLoans(data.data);
            }
        })
        .catch((error) => {
            setToastMessage("Failed to load data over network");
            console.log(error);
            setToastState(true);
        });
    }
    useEffect(() => {
        loadLoans();
    }, []);

    return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>{params?.customer.first_name}'s Details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent >
        <IonItemDivider>Personal Information</IonItemDivider>
        <IonItem>
            <IonLabel><b>Name:</b></IonLabel>
            <IonInput value={params?.customer.first_name + ' ' + params?.customer.surname} readonly></IonInput>
        </IonItem>
        <IonItem>
            <IonLabel><b>Contact No./Phone No.:</b></IonLabel>
            <IonInput value={params?.customer.phone} readonly></IonInput>
        </IonItem>
        <IonItem>
            <IonLabel><b>Address:</b></IonLabel>
            <IonInput value={params?.customer.region + ', ' + params?.customer.city} readonly></IonInput>
        </IonItem>
        <span className="empty-space-2"></span>
        <IonItemDivider>Loan Information</IonItemDivider>
        {loans && loans.map((loan: any) =>
          <IonCard key={loan.id}>
            <IonCardHeader>
              <IonCardTitle>
                <i>GHS {loan.amount}</i>
              </IonCardTitle>
            </IonCardHeader>
            <IonItem>Amount Repaid<IonBadge color="success" slot="end">GHS {loan.amount_repaid}</IonBadge></IonItem>
            <IonItem>Arears <IonBadge color="danger" slot="end">GHS {Math.abs(-loan.amount+loan.amount_repaid)}</IonBadge></IonItem>
            <IonItem>Prepayments <IonBadge color="primary" slot="end">GHS {loan.amount}</IonBadge></IonItem>

          </IonCard>
          )} 
      </IonContent>
      <IonToast
          isOpen={toastState}
          onDidDismiss={() => setToastState(false)}
          message={toastMessage}
          duration={4000}
        />      
    </IonPage>
  );
};

export default React.memo(Tab1Detail);