import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AppContext, Post } from '../context/AppContext';
import PostCard from '../components/PostCard';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { posts } = useContext(AppContext);
  const navigation = useNavigation();

  // Merge sort posts by createdAt date (newest first)
  const mergeSortPosts = (posts: Post[]): Post[] => {
    if (posts.length <= 1) return posts;
    const mid = Math.floor(posts.length / 2);
    const left = mergeSortPosts(posts.slice(0, mid));
    const right = mergeSortPosts(posts.slice(mid));
    return merge(left, right);
  };

  const merge = (left: Post[], right: Post[]): Post[] => {
    let result: Post[] = [];
    while (left.length && right.length) {
      if (new Date(left[0].createdAt) > new Date(right[0].createdAt)) {
        result.push(left.shift()!);
      } else {
        result.push(right.shift()!);
      }
    }
    return result.concat(left, right);
  };

  const sortedPosts = mergeSortPosts(posts);

  return (
    <View style={styles.container}>
      {sortedPosts.length === 0 ? (
        <Text style={styles.noPostsText}>No posts available. Create one!</Text>
      ) : (
        <FlatList
          data={sortedPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { post: item })}>
              <PostCard post={item} />
            </TouchableOpacity>
          )}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  noPostsText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
