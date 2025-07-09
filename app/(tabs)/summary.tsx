    import { CompletedSession, useTimer } from '@/contexts/TimerContext';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';

    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      let timeString = '';
      if (hours > 0) timeString += `${hours}h `;
      if (minutes > 0) timeString += `${minutes}m `;
      if (secs > 0 || timeString === '') timeString += `${secs}s`;
      return timeString.trim();
    };

    export default function SummaryScreen() {
      const { completedSessions } = useTimer();

      if (completedSessions.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No records yet!</Text>
            <Text style={styles.emptySubText}>Stop a timer to save your first session.</Text>
          </View>
        );
      }

      const renderItem = ({ item }: { item: CompletedSession }) => (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Title style={styles.cardTitle}>{item.name}</Title>
              <Paragraph style={styles.durationText}>{formatTime(item.duration)}</Paragraph>
            </View>
            <Paragraph style={styles.notesText}>{item.notes || 'No notes'}</Paragraph>
          </Card.Content>
        </Card>
      );

      return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Summary</Text>
            <FlatList
              data={completedSessions}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
            />
        </View>
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 60,
      },
      headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        marginBottom: 20,
      },
      list: {
        paddingHorizontal: 20,
      },
      card: {
        marginBottom: 15,
        backgroundColor: '#F2F2F7',
      },
      cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      cardTitle: {
        fontWeight: 'bold',
      },
      durationText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#34C759' // A nice green for earnings
      },
      notesText: {
        marginTop: 8,
        color: 'gray',
      },
      emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      emptyText: {
        fontSize: 22,
        fontWeight: 'bold',
      },
      emptySubText: {
        fontSize: 16,
        color: 'gray',
        marginTop: 8,
      },
    });