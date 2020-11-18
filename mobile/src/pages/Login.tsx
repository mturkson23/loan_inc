import React, {FormEvent, useState} from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonToast, IonItem, IonInput, IonButton } from '@ionic/react';
// import ExploreContainer from '../components/ExploreContainer';
import './Login.css';

import axios from 'axios';
import { useHistory } from "react-router-dom";

import { Plugins } from '@capacitor/core';
// import { alert } from 'ionicons/icons';
const { Storage } = Plugins;

const Login: React.FC = () => {
  const [toastState, setToastState] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  // const [action, setAction] = useState("");

  const history = useHistory();

  const setItem = async (key: string, value: string) => {
    await Storage.set({
      key: key,
      value: value
    });
  }  

  const updatePhone =(event: any)=>{
    setPhone(event?.detail?.value);
  }

  const updatePassword =(event: any)=>{
    // console.log('updatePassword')
    setPassword(event?.detail?.value);
  }

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    //validate inputs code not shown
    if ((phone?.length < 1) || (password?.length < 1)){
      return;
    }
    const loginData = {
      phone: phone,
      password: password,
    };
    // placing this here for shege reasons
    // might end up going away
    setItem('user_phone', phone);

    const api = axios.create({
      baseURL: `http://127.0.0.1:8001`,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Accept': 'application/json'
      }
    });  
    
    api.post("/auth", loginData)
      .then((res) => {
        setToastMessage("Login success!");
        setToastState(true);
        console.log(res)
        setItem('userPhone',phone);
        history.push("/tab1");
      })
      .catch((error) => {
        console.log(error)
        setToastMessage("Authentication failed! Please check your phone/password and try again.");
        setToastState(true);
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <span className="empty-space-4"></span>
        <div className="ion-text-center">
          <img src='./assets/logo.png' alt="logo" width="65%" />
        </div>
        <h1 className="ion-text-center header-title">Welcome</h1>
        <p className="ion-text-center">Join the league of agents collecting payments for Loan Inc.</p>
        <IonToast
          isOpen={toastState}
          onDidDismiss={() => setToastState(false)}
          message={toastMessage}
          duration={4000}
        />
        <form>
          <IonItem>
            <IonInput onIonChange={updatePhone} type="tel" placeholder="Phone"></IonInput>
          </IonItem>
          <IonItem>
            <IonInput onIonChange={updatePassword} type="password" placeholder="Password"></IonInput>
          </IonItem>
        </form>

        <IonButton onClick={handleLogin} expand="full">Login</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
