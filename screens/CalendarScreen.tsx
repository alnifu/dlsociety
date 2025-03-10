import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { AppContext } from '../context/AppContext';

// Configure locale
LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  monthNamesShort: [
    'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.',
    'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
  ],
  dayNames: [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};
LocaleConfig.defaultLocale = 'en';

const CalendarScreen = ({ navigation }: any) => {
  // Default selected date is today.
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const { posts } = useContext(AppContext);

  // Filter posts that are events and have a valid eventDate.
  const eventPosts = posts.filter(post => post.isEvent && post.eventDate);

  // Mark all event dates on the calendar.
  const markedDates: any = {};
  eventPosts.forEach(post => {
    const dateStr = new Date(post.eventDate!).toISOString().split('T')[0];
    markedDates[dateStr] = { marked: true, dotColor: 'red' };
  });

  // Filter events for the selected date.
  const postsForDate = eventPosts.filter(post => {
    const eventDateStr = new Date(post.eventDate!).toISOString().split('T')[0];
    return eventDateStr === selectedDate;
  });

  // Determine the label for the selected date.
  let eventTypeLabel = '';
  if (selectedDate === todayStr) {
    eventTypeLabel = 'Ongoing Events';
  } else if (selectedDate > todayStr) {
    eventTypeLabel = 'Upcoming Events';
  } else {
    eventTypeLabel = 'Past Events';
  }

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, selectedColor: 'green' },
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        style={styles.calendar}
      />
      <View style={styles.eventsHeader}>
        <Text style={styles.eventsHeaderText}>{eventTypeLabel}</Text>
      </View>
      <FlatList
        data={postsForDate}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventItem}
            onPress={() => navigation.navigate('PostDetail', { post: item })}
          >
            <Text style={styles.eventText}>{item.heading}</Text>
            <Text style={styles.eventDate}>
              {new Date(item.eventDate!).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noEventText}>No events on this date.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendar: {
    marginBottom: 10,
  },
  eventsHeader: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  eventsHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  eventItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  eventText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
  noEventText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default CalendarScreen;
