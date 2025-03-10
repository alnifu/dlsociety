import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { AppContext } from '../context/AppContext';

interface Reward {
  id: string;
  name: string;
  image: string;
  cost: number;
}

const RewardsScreen: React.FC = () => {
  const { rewards, user } = useContext(AppContext);
  const numColumns = 2;
  const { width } = useWindowDimensions();
  const itemWidth = width / numColumns - 20;

  const renderReward = ({ item }: { item: Reward }) => (
    <View style={[styles.rewardCard, { width: itemWidth }]}>
      <Image source={{ uri: item.image }} style={styles.rewardImage} />
      <Text style={styles.rewardName}>{item.name}</Text>
      <Text style={styles.rewardCost}>{item.cost} Points</Text>
      <TouchableOpacity style={styles.redeemButton} onPress={() => {/* Implement redeem logic */}}>
        <Text style={styles.buttonText}>Redeem</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pointsText}>
        Your Points: {user?.rewardPoints || 0}
      </Text>
      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id}
        renderItem={renderReward}
        numColumns={numColumns}
        contentContainerStyle={styles.rewardsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  pointsText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  rewardsList: {
    alignItems: 'center',
  },
  rewardCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    margin: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  rewardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 5,
    textAlign: 'center',
  },
  rewardCost: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  redeemButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default RewardsScreen;
