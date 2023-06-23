import { View, ScrollView, StyleSheet, Text } from "react-native";
import Header from "./obj/Header";
import Button from "./obj/Button";
import Menu_professional from "./obj/Menu_professional";
import moment from "moment";
import { FutureAppointmentB, allApoB } from "./obj/FunctionAPICode";
import { useState } from "react";
import { UserContext } from '../comps/UserDietails';
import React, { useContext } from "react";
import { FutureAppointmenB } from "./obj/FunctionAPICode";
import { Post_SendPushNotification } from "./obj/FunctionAPICode";
import AppointmentCard_forProfessional_Calendar from "./obj/AppointmentCard_forProfessional_Calendar";
import { ClientDetailes } from "./obj/FunctionAPICode";
//מסך ראשי בעל עסק
export default function Calendar_professional() {


  const { userDetails, setUserDetails } = useContext(UserContext);
  const BussinesNumber = userDetails.Business_Number;

  const [allAppointment, setallAppointment] = useState([])
  const [allAppointmentAvilable, setallAppointmentAvilable] = useState([])
  const [allAppointmentEnd, setallAppointmentEnd] = useState([])
  const [FutureAppointment, setFutureAppointment] = useState([])
  const [Client, setclient] = useState([])

  const [showText, setShowText] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [showText3, setShowText3] = useState(false);
  const [showText4, setShowText4] = useState(false);

  const namecli = "";

  const test = () => {

    const body = {
      "to": userDetails.Token,
      "title": "BeautyMe",
      "body": `${userDetails.First_name} הוספת תור חדש`,
      "badge": "0",
      "ttl": "1",// מספר שניות לשליחה
      "data": {
        "to": userDetails.Token
      }
    }
    console.log({ userDetails })
    Post_SendPushNotification(body).then(() => {

    }).catch((error) => {
      console.log("error", error);
    })

  }

  const handleSubmit = () => {
    console.log(allAppointment, allAppointment.length)

    allApoB(BussinesNumber).then((result) => {

      if (result.data)
        setallAppointment(result.data)


    }, (error) => {
      console.log('error', error)
    })

    setShowText2(!showText2);

  }


  const handleSubmit2 = () => {

    allApoB(BussinesNumber).then((result) => {

      if (result.data) {
        setallAppointmentAvilable(result.data)
      }
      console.log(allAppointmentAvilable.length, "*****")

    }, (error) => {
      console.log('error', error)
    })

    setShowText(!showText);
  }

  const handleSubmit4 = () => {

    allApoB(BussinesNumber).then((result) => {

      if (result.data)
        setallAppointmentEnd(result.data)

    }, (error) => {
      console.log('error', error)
    })

    setShowText4(!showText4);
  }

  const handleSubmit3 = () => {

    FutureAppointmenB(BussinesNumber).then((result) => {

      if (result.data)
        console.log(result.data)
      setFutureAppointment(result.data)
      console.log("****", FutureAppointment.length)
    }, (error) => {
      console.log('error', error)
    })

    setShowText3(!showText3);
  }



  return (
    <>

      <ScrollView>
        <View style={styles.view}>

          <ScrollView horizontal={true}>
            <View style={styles.container}>

              <Button title={showText2 ? 'Hide Text' : 'Show Text'} onPress={handleSubmit} text="כל התורים" color="rgb(92, 71, 205)" colortext="white"/>
              <Button title={showText ? 'Hide Text' : 'Show Text'} onPress={handleSubmit2} text="תורים פנויים" color="rgb(92, 71, 205)" colortext="white"/>
              <Button title={showText3 ? 'Hide Text' : 'Show Text'} onPress={handleSubmit3} text="תורים שנקבעו" color="rgb(92, 71, 205)" colortext="white"/>
              <Button title={showText4 ? 'Hide Text' : 'Show Text'} onPress={handleSubmit4} text="תורים שנגמרו" color="rgb(92, 71, 205)" colortext="white"  />
              {/* <Button title={showText4 ? 'Hide Text' : 'Show Text'} onPress={test} text=" cshev" color="#87CEFA" /> */}
            </View>
          </ScrollView>


          {showText2 && <View style={styles.view1}>
            {allAppointment && allAppointment.length > 0 &&
              allAppointment.map(x => {
               
                console.log(x.Date)
                return (
                  <AppointmentCard_forProfessional_Calendar
                    key={x.Number_appointment}
                    Number_appointment={x.Number_appointment}
                    backgroundColor={"rgb(92, 71, 205)"}
                    // Treatment_Type= 
                    status={x.Appointment_status}
                    Date={x.Date}
                    Start_time={x.Start_time}
                    End_time={x.End_time}
                    Client_Name={x.First_name}
                    Client_Last_Name={x.Last_name}
                  />
                )
              })}
          </View>}

          {showText && <View style={styles.view1}>
            {allAppointmentAvilable &&
              allAppointmentAvilable.map(x => {
                if (x.Appointment_status == "Available" || x.Appointment_status == "available")
                  return (
                    <AppointmentCard_forProfessional_Calendar
                    key={x.Number_appointment}
                    Number_appointment={x.Number_appointment}  
                    backgroundColor={"rgb(92, 71, 205)"}
                      status={x.Appointment_status}
                      Date={x.Date}
                      Start_time={x.Start_time}
                      End_time={x.End_time}
                    />
                  )
              })}
          </View>}


          {showText4 && <View>
            {allAppointmentEnd && allAppointmentEnd.length > 0 &&
              allAppointmentEnd.map(x => {
                if (x.Appointment_status == "Appointment_ended")
                  return (
                    <AppointmentCard_forProfessional_Calendar
                    key={x.Number_appointment}
                    Number_appointment={x.Number_appointment} 
                    backgroundColor={"rgb(92, 71, 205)"}
                      status={x.Appointment_status}
                      Date={x.Date}
                      Start_time={x.Start_time}
                      End_time={x.End_time}
                    />
                  )
              })}
          </View>}


          {showText3 && <View style={styles.view1}>
            {FutureAppointment && FutureAppointment.length > 0 &&
              FutureAppointment.map(x => {
                return (
                  <AppointmentCard_forProfessional_Calendar
                  key={x.Number_appointment}
                    Number_appointment={x.Number_appointment} 
                  backgroundColor={"rgb(92, 71, 205)"}
                    status={x.Appointment_status}
                    Date={x.Date}
                    Start_time={x.Start_time}
                    End_time={x.End_time}
                    Client_Name={x.First_name_client}
                    Client_Last_Name={x.Last_name_client}
                  />
                )
              })}
          </View>}
        </View>

      </ScrollView>
      <Menu_professional />
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 12,
    flexDirection: 'row',
    // alignItems: 'center'

  },

  view1: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 10,
    //  borderColor:'#9acd32'

  },
  view: {
    flex: 1,
    flexDirection: 'column',

  },
  wel: {
    textAlign: "center",
    fontSize: 30,
    color: '#9acd32',
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    color:"white"
  }


});