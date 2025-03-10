import React, { useContext, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AppContext, Post, Comment } from '../context/AppContext';
import uuid from 'react-native-uuid';

interface PostDetailScreenProps {
  route: {
    params: {
      post: Post;
    };
  };
}

const PostDetailScreen: React.FC<PostDetailScreenProps> = ({ route }) => {
  const { post: routePost } = route.params;
  const {
    user,
    posts,
    likePost,
    unlikePost,
    addComment,
    updateComment,
    deleteComment,
  } = useContext(AppContext);

  // Use the most up-to-date version of the post from context
  const currentPost = posts.find((p) => p.id === routePost.id) || routePost;

  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const alreadyLiked = user?.likedPosts?.includes(currentPost.id);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: uuid.v4().toString(),
      author: user ? user.username : 'Guest',
      content: commentText,
      createdAt: new Date(),
    };
    addComment(currentPost.id, newComment);
    setCommentText('');
  };

  const handleUpdateComment = (comment: Comment) => {
    if (!editingText.trim()) return;
    const updatedComment = { ...comment, content: editingText };
    updateComment(currentPost.id, updatedComment);
    setEditingCommentId(null);
    setEditingText('');
  };

  // Memoized render function for comments
  const renderComment = useCallback(
    ({ item }: { item: Comment }) => {
      const isEditing = editingCommentId === item.id;
      return (
        <View style={styles.commentContainer}>
          <Text style={styles.commentAuthor}>{item.author} says:</Text>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={editingText}
                onChangeText={setEditingText}
                placeholder="Edit comment..."
              />
              <Button title="Save" onPress={() => handleUpdateComment(item)} />
            </>
          ) : (
            <>
              <Text style={styles.commentContent}>{item.content}</Text>
              <View style={styles.commentButtons}>
                <TouchableOpacity
                  onPress={() => {
                    setEditingCommentId(item.id);
                    setEditingText(item.content);
                  }}
                >
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteComment(currentPost.id, item.id)}
                >
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      );
    },
    [editingCommentId, editingText, currentPost.id, deleteComment]
  );

  // Header component displaying the post details
  const ListHeader = () => (
    <View style={styles.postCard}>
      <Text style={styles.heading}>{currentPost.heading}</Text>
      <Text style={styles.body}>{currentPost.body}</Text>
      <Button
        title={
          alreadyLiked
            ? `Unlike (${currentPost.likes})`
            : `Like (${currentPost.likes})`
        }
        onPress={() =>
          alreadyLiked
            ? unlikePost(currentPost.id)
            : likePost(currentPost.id)
        }
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={currentPost.comments}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <Text style={styles.noComments}>No comments yet.</Text>
        }
        contentContainerStyle={styles.listContainer}
        keyboardShouldPersistTaps="handled"
      />
      <View style={styles.commentFooter}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={commentText}
          onChangeText={setCommentText}
        />
        <Button color="#28a745" title="Add Comment" onPress={handleAddComment} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  listContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  postCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
  },
  commentContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  commentAuthor: {
    fontWeight: 'bold',
  },
  commentContent: {
    marginVertical: 5,
    fontSize: 15,
  },
  commentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    color: 'blue',
    marginRight: 10,
  },
  deleteButton: {
    color: 'red',
  },
  addButton: {
    backgroundColor: '#28a745',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginVertical: 5,
    flex: 1,
  },
  noComments: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 10,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
});

export default PostDetailScreen;
