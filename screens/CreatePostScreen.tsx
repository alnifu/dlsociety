import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Switch,
  Button,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppContext, Post } from '../context/AppContext';
import RichTextEditor from '../components/RichTextEditor';
import PostCard from '../components/PostCard'; // Using your PostCard design
import uuid from 'react-native-uuid';

const CreatePostScreen = ({ navigation }: any) => {
  const { user, addPost } = useContext(AppContext);
  const [organization, setOrganization] = useState('');
  const [heading, setHeading] = useState('');
  const [body, setBody] = useState('');
  const [isEvent, setIsEvent] = useState(false);
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleSubmit = () => {
    if (!heading || !body) {
      alert('Please fill in heading and body.');
      return;
    }
    const newPost: Post = {
      id: uuid.v4().toString(),
      organization,
      author: user ? user.username : 'Anonymous',
      heading,
      body,
      isEvent,
      eventDate: isEvent ? eventDate : undefined,
      createdAt: new Date(),
      likes: 0,
      comments: [],
    };
    addPost(newPost);
    navigation.navigate('Home');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newEventDate = new Date(eventDate);
      newEventDate.setHours(selectedTime.getHours());
      newEventDate.setMinutes(selectedTime.getMinutes());
      setEventDate(newEventDate);
    }
  };

  // Create a temporary post object for the preview
  const previewPost: Post = {
    id: 'preview', // temporary id
    organization,
    author: user ? user.username : 'Anonymous',
    heading,
    body,
    isEvent,
    eventDate: isEvent ? eventDate : undefined,
    createdAt: new Date(),
    likes: 0,
    comments: [],
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Organization</Text>
      <TextInput
        style={styles.input}
        value={organization}
        onChangeText={setOrganization}
        placeholder="Enter your organization"
      />
      <Text style={styles.label}>Heading</Text>
      <TextInput
        style={styles.input}
        value={heading}
        onChangeText={setHeading}
        placeholder="Enter post heading"
      />
      <Text style={styles.label}>Body</Text>
      <RichTextEditor content={body} onChange={setBody} />
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Is Event?</Text>
        <Switch value={isEvent} onValueChange={setIsEvent} />
      </View>
      {isEvent && (
        <View>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>
              Select Date: {eventDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={eventDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <Text style={styles.dateText}>
              Select Time: {eventDate.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={eventDate}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>
      )}
      <View style={styles.buttonContainer}>
        <CustomButton title="Preview" onPress={() => setPreviewVisible(true)} />
        <CustomButton title="Submit Post" onPress={handleSubmit} />
      </View>

      {/* Preview Modal using the PostCard design */}
      <Modal visible={previewVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Post Preview</Text>
          <PostCard post={previewPost} />
          <View style={styles.closeButtonContainer}>
            <CustomButton title="Close Preview" onPress={() => setPreviewVisible(false)}
            />
          </View>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress }) => (
  <TouchableOpacity style={styles.customButton} onPress={onPress}>
    <Text style={styles.customButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  dateText: {
    fontSize: 16,
    color: '#1E90FF',
    marginBottom: 15,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  customButton: {
    backgroundColor: '#28a745',
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  customButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '700',
  },
  closeButtonContainer: {
    marginTop: 20,
  },
});

export default CreatePostScreen;
