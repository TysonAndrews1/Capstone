import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import MainLayout from "../../layouts/MainLayout";
import CalendarComponent from "../../components/Calender";
import MiniSchedule from "../../components/MiniSchedule";
import { useRouter } from 'expo-router';

const ManageEvents = () => {
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 (기본값 null)
  const [events, setEvents] = useState([]); // 모든 이벤트 데이터
  const [filteredEvents, setFilteredEvents] = useState([]); // 선택된 날짜의 필터링된 이벤트
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // 모든 이벤트 데이터 가져오기
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://10.0.2.2:8080/api/events");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 날짜 기준으로 이벤트 필터링
  const filterEventsByDate = (date) => {
    if (!date) return []; // 날짜가 null이면 빈 배열 반환
    return events.filter((event) => {
      const eventDate = new Date(event.eventStartDate); // 이벤트 시작 날짜 (UTC 기준)
      return (
        eventDate.getUTCFullYear() === date.getUTCFullYear() &&
        eventDate.getUTCMonth() === date.getUTCMonth() &&
        eventDate.getUTCDate() === date.getUTCDate()
      );
    });
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (date) => {
    setSelectedDate(date); // 선택된 날짜 설정
    const filtered = filterEventsByDate(date);
    setFilteredEvents(filtered); // 필터링된 이벤트 업데이트
  };

  // 컴포넌트 로드 시 모든 이벤트 데이터 가져오기
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <MainLayout>
      <View style={styles.container}>
        {/* 캘린더 컴포넌트 */}
        <View style={styles.calendarWrapper}>
          <CalendarComponent onDateSelect={handleDateSelect} />
        </View>
        {/* 날짜 선택 여부에 따른 조건부 렌더링 */}
        {selectedDate ? (
          // 날짜가 선택된 경우: 필터링된 이벤트 목록 표시
          <ScrollView style={{ flex: 1, marginTop: 10 }}>
            {loading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <MiniSchedule
                  key={event.eventId}
                  EventName={event.eventName}
                  EventStartTime={event.eventStartDate}
                  EventEndTime={event.eventEndDate}
                  Guests={event.numberOfGuests}
                />
              ))
            ) : (
              <Text style={styles.noEventsText}>No events for this date.</Text>
            )}
          </ScrollView>
        ) : (
          // 날짜가 선택되지 않은 경우: 안내 메시지와 버튼 표시
          <View style={styles.noDateContainer}>
            <Text style={styles.noDateText}>Select a day to view events</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('screens/manager/EventEdit')}
            >
              <Text style={styles.createButtonText}>Create new event</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </MainLayout>
  );
};

export default ManageEvents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  noDateContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10, // 달력과 텍스트 간격을 줄이기
  },
  noDateText: {
    fontSize: 18,
    color: "#F4A261",
    textAlign: "center",
    marginBottom: 10, // 텍스트와 버튼 간의 여백
  },
  createButton: {
    marginTop: 10, // 버튼과 텍스트 사이 간격
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: "#E6F2FA",
    borderRadius: 5,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  calendarWrapper: {
    marginBottom: 10, // 달력 아래 간격 줄이기
  },
});