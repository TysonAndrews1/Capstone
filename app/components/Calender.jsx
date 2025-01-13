import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";

const CalendarComponent = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // 날짜 선택/해제 로직
  const onDayPress = (day) => {
    const selected = new Date(day.dateString); // YYYY-MM-DD -> Date 객체 (UTC)

    if (selectedDate && selectedDate.toISOString() === selected.toISOString()) {
      // 날짜를 다시 선택하면 해제
      setSelectedDate(null);
      onDateSelect(null); // 선택 해제
    } else {
      // 새로운 날짜를 선택
      setSelectedDate(selected);
      onDateSelect(selected); // UTC 날짜 그대로 상위 컴포넌트로 전달
    }
  };

  return (
    <View style={styles.calendarWrapper}>
      <Calendar
        current={new Date().toISOString().split('T')[0]}
        minDate={'2020-01-01'}
        maxDate={'2030-12-31'}
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate?.toISOString().split("T")[0]]: {
            selected: true,
            selectedColor: "#FFB74D",
            selectedTextColor: "#fff",
          },
        }}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#f9f9f9',
          textSectionTitleColor: '#000',
          selectedDayBackgroundColor: '#FFB74D',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#000',
          dayTextColor: '#2d4150',
          arrowColor: '#3F6D89',
          monthTextColor: '#000',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          textDayFontSize: 14,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 16,
          // 스타일시트에서 요일 텍스트의 넓이를 조정
          'stylesheet.calendar.header': {
            dayTextAtIndex0: { width: '14%', textAlign: 'center' }, // Sunday
            dayTextAtIndex1: { width: '14%', textAlign: 'center' }, // Monday
            dayTextAtIndex2: { width: '14%', textAlign: 'center' }, // Tuesday
            dayTextAtIndex3: { width: '14%', textAlign: 'center' }, // Wednesday
            dayTextAtIndex4: { width: '14%', textAlign: 'center' }, // Thursday
            dayTextAtIndex5: { width: '14%', textAlign: 'center' }, // Friday
            dayTextAtIndex6: { width: '14%', textAlign: 'center' }, // Saturday
          },
        }}
        style={styles.calendar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarWrapper: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    alignSelf: 'center',
  },
  calendar: {
    borderRadius: 10,
  },
});

export default CalendarComponent;
