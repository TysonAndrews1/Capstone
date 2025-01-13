import React from "react";
import { StyleSheet,Text } from "react-native";
import { View } from "react-native";

export default function MiniSchedule({EventName, EventStartTime}){

    const Months =["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sept","Oct","Nov","Dec"]
    const date = new Date(EventStartTime)
    const MonthNumber = date.getMonth()
    const day = date.getDate()
    
    let weekday =  date.toLocaleDateString('en-US', { weekday: 'long' }).slice(0,3);
    let Month = Months[MonthNumber]
    return(
        <View style = {styles.container}>
            <View style = {styles.childContainer}>
                <Text style={styles.bold} >{Month}</Text>
                <Text style = {styles.orange}>{day}</Text>
                <Text style={styles.bold}>{weekday} </Text>
            </View>
            <View style = {styles.childContainer}>
                <Text style={styles.bold}>
                    {EventName}
                </Text>
            </View>
            <View style = {styles.childContainer}>
            <Text style = {styles.grey}>View Event</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection:"row",
        backgroundColor:"#E6F2Fa",
        height:80,
        justifyContent:'space-between',
        borderRadius:5,
        marginHorizontal:10,
        borderColor:'lightgrey',
        borderWidth:1
    },
    childContainer:{
        flexDirection:"column",
        justifyContent:'center',
        margin: 10
    },
    bold:{
        fontWeight:'bold',
        fontSize:16,
        textAlign:'center'
    },
    orange:{
        color:"#F4A261",
        fontSize:20,
        textAlign:'center'
    },
    grey:{
        color:'grey'
    }

});