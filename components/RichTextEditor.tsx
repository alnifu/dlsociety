import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface RichTextEditorProps {
  content: string;
  onChange: (text: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  return (
    <TextInput
      style={styles.editor}
      multiline
      value={content}
      onChangeText={onChange}
      placeholder="Enter post content..."
      textAlignVertical="top"
    />
  );
};

const styles = StyleSheet.create({
  editor: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
});

export default RichTextEditor;
