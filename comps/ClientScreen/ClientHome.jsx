import React, { useContext, useEffect,useState } from 'react';
import { StyleSheet, View, Text,TouchableOpacity, Image, Linking, ScrollView} from 'react-native';
import { UserContext } from '../UserDietails';
import Header from '../obj/Header';
import { useNavigation} from "@react-navigation/core";
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import { openURL, canOpenURL } from "expo-linking";
import Menu_Client from '../obj/Menu_Client';
import {NewSearchPost, Treatment_type_GET, Post_SendPushNotification,} from "../obj/FunctionAPICode";
import AvailableAppointmentToBook_New from './AvailableAppointmentToBook_New';
import Carousel from 'react-native-snap-carousel';
import AvailableAppointmentForTreatment from './AvailableAppointmentForTreatment';


    



const ClientHome = (Props) => {
    const [result, SetResult] = useState([]);
    const [treatmentNumber, SetTreatmentNumber] = useState("");
    const [categories, setCategories] = useState([]);
    const [Type_treatment, setType_treatment] = useState([]);



    const { userDetails, setUserDetails } = useContext(UserContext);
const navigation=useNavigation();
useEffect(()=>{
    // console.log("profile pro = "+JSON.stringify(userDetails));

    // console.log(userDetails.AddressCity, "11111111111")
    const obj = {
        // AddressCity: userDetails.AddressCity,
        TreatmentNumber: 4,
    //    AddressCity: "נתניה",

        // TreatmentNumber: treatmentNumber,
        // sort: "דירוג גבוהה תחילה",
        // Is_client_house: Is_client_house,
      };
      NewSearchPost(obj).then(
        (result) => {
        //   console.log("yes", result.data, "556565655656565");
          if (result.data) {
            GetData(result.data);
          }
        },
        (error) => {
          console.log("error", error);
        }
      );

      Treatment_type_GET().then(
        (result) => {
        //   console.log("categories: ", result);
          if (result) {
            setType_treatment(result);
            console.log(result, "gfgfgfgfg")
            SetTreatmentNumber(result[0].Type_treatment_Number);
          }
        },
        (error) => {
          console.log("error", error);
        }
      );

},[])

function GetData(data) {
    let res = [];
    let obj = {
      id: data[0].Business_Number,
      businessName: data[0].Name,
      streetAddress: data[0].AddressStreet,
      houseNumber: data[0].AddressHouseNumber,
      city: data[0].AddressCity,
      about: data[0].about,
      phone: data[0].phone,
      facebook: data[0].Facebook_link,
      instagram: data[0].Instagram_link,
      LongCordinate: data[0].LongCordinate,
      LetCordinate: data[0].LetCordinate,
      Is_client_house: data[0].Is_client_house1,
      diary: [
        {
          date: data[0].Date1,
          time: [data[0].Start_time + "-" + data[0].End_time],
        },
      ],
      typeTritment: [
        {
          duration: data[0].duration,
          type: data[0].Type_treatment_Number,
          price: data[0].Price,
        },
      ],
      apointemnt: [
        {
          number: data[0].Number_appointment,
          status: data[0].Appointment_status,
          date: data[0].Date,
          time: [data[0].Start_Hour + "-" + data[0].End_Hour],
        },
      ],
    };
    let typeTritment = [data[0].Type_treatment_Number];
    for (let i = 1; i < data.length; i++) {
      if (data[i].Business_Number == data[i - 1].Business_Number) {
        //בודק האם העסק שווה לקודם
        if (data[i].Date1 == obj.diary[obj.diary.length - 1].date) {
          // בודק האם יש עוד טווח שעות שונה באותו תאריך
          if (
            !obj.diary[obj.diary.length - 1].time.includes(
              data[i].Start_time + "-" + data[i].End_time
            )
          ) {
            obj.diary[obj.diary.length - 1].time.push(
              data[i].Start_time + "-" + data[i].End_time
            );
          }
        } else {
          // פותח מיקום חדש במערך לתאריך חדש
          obj.diary.push({
            date: data[i].Date1,
            time: [data[i].Start_time + "-" + data[i].End_time],
          });
        }
        if (
          data[i].Type_treatment_Number !=
            obj.typeTritment[obj.typeTritment.length - 1].type &&
          !typeTritment.includes(data[i].Type_treatment_Number)
        ) {
          //אם הסוג טיפול שונה מקודמו
          typeTritment.push(data[i].Type_treatment_Number);
          obj.typeTritment.push({
            duration: data[i].duration,
            type: data[i].Type_treatment_Number,
            price: data[i].Price,
          });
        }
        if (
          data[i].Number_appointment !=
          obj.apointemnt[obj.apointemnt.length - 1].number
        ) {
          //אם המספר תור שונה מקודמו
          obj.apointemnt.push({
            number: data[i].Number_appointment,
            status: data[i].Appointment_status,
            date: data[i].Date,
            time: data[i].Start_Hour + "-" + data[i].End_Hour,
          });
        }
      } else {
        res.push(obj);
        typeTritment = [data[i].Type_treatment_Number];
        obj = {
          id: data[i].Business_Number,
          businessName: data[i].Name,
          streetAddress: data[i].AddressStreet,
          houseNumber: data[i].AddressHouseNumber,
          city: data[i].AddressCity,
          about: data[i].about,
          phone: data[i].phone,
          facebook: data[i].Facebook_link,
          instagram: data[i].Instagram_link,
          LongCordinate: data[i].LongCordinate,
          LetCordinate: data[i].LetCordinate,
          diary: [
            {
              date: data[i].Date1,
              time: [data[i].Start_time + "-" + data[i].End_time],
            },
          ],
          typeTritment: [
            {
              duration: data[i].duration,
              type: data[i].Type_treatment_Number,
              price: data[i].Price,
            },
          ],
          apointemnt: [
            {
              number: data[i].Number_appointment,
              status: data[i].Appointment_status,
              date: data[i].Date,
              time: [data[i].Start_Hour + "-" + data[i].End_Hour],
            },
          ],
        };
      }
    }
    // console.log(obj);
    res.push(obj);
    SetResult(res);
    // console.log(res, "333333333333333444444444444444444444444444333333333333333333")
    return res;
  }

  
  const handleCardClick = (treatment) => {
    navigation.navigate('AvailableAppointmentForTreatmentAndCity',{treatmentName: treatment})
};

  

    return (
        <View style={styles.container}>
        <Header text="דף הבית" fontSize={50} height={200} color={"rgb(92, 71, 205)"} />
        <Text>בא לי היום:</Text>

        <Carousel
      data={Type_treatment}
      renderItem={({ item }) => (
        <AvailableAppointmentForTreatment
        key={item.Type_treatment_Number}
          result={item}
          title={item.Name}
        />
      )}
      onPress ={() => handleCardClick(item.Type_treatment_Number)}

      sliderWidth={400}
      itemWidth={180} // Each item width is 100 (adjust as needed)
      activeSlideOffset={20} // Adjust the spacing between active and inactive items
      inactiveSlideOpacity={1} // Adjust the opacity of inactive items
      inactiveSlideScale={1} // Adjust the scale of inactive items
      loop={true} // Enable infinite loop
      enableSnap={true} // Enable snap behavior
    />


        
            <Text>עסקים פנויים היום באיזורך:</Text>

            <Carousel
      data={result}
      renderItem={({ item }) => (
        <AvailableAppointmentToBook_New
          result={item}
          treatmentNumber={4}
        />
      )}
      sliderWidth={400}
      itemWidth={180} // Each item width is 100 (adjust as needed)
      activeSlideOffset={20} // Adjust the spacing between active and inactive items
      inactiveSlideOpacity={1} // Adjust the opacity of inactive items
      inactiveSlideScale={1} // Adjust the scale of inactive items
      loop={true} // Enable infinite loop
      enableSnap={true} // Enable snap behavior
    />


     <Text>העסקים המובילים:    אלמנט חכם</Text>







            {/* <ScrollView>
          {result.map((r) => (
            <AvailableAppointmentToBook_New
              key={r.id}
              result={r}
              treatmentNumber= {4}
            />
          ))}
        </ScrollView> */}

               
       
            <Menu_Client />
        </View>
    )
}

const styles = StyleSheet.create({
    // container: {
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     // backgroundColor: '#f8f8ff',
    //     opacity: 0.9,
    //     // borderColor: '#800080',
    //     // borderWidth: 2,
    //     // borderRadius: 10,
    //     width: '90%',
    //     height: '40%',
        
    // },
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6e6fa',
        paddingTop:20,
        marginTop:0,
    },
    button: {
        alignItems: 'center',
        backgroundColor: "rgb(92, 71, 205)",
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
    },
    img: {
        borderRadius: 150,
        marginBottom: 20,
        width: 250,
        height: 250,
    },
    view1:{
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6e6fa',
        
    },
    greeting: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
      },
    tit:{
    "fontSize": 40,
    "fontWeight": "500",
    "letterSpacing": 0.15,
    "lineHeight": 50,
    textShadowColor: 'rgb(92, 71, 205)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    opacity:0.7
    },
    iconContainer: {
        flexDirection: "row",
        // justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        // width: "50%",
        marginTop: 10,
        marginBottom: 10,
      },
});

export default ClientHome; 