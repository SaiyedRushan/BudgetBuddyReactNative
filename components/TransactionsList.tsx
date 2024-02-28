import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Animated, StyleSheet, Button } from "react-native";
import { PanGestureHandler, RectButton, State } from "react-native-gesture-handler";
import React, { useState } from "react";
import { Category, Transaction } from "../types";
import TransactionListItem from "./TransactionListItem";
import Swipeable from "react-native-gesture-handler/Swipeable";

interface TransactionsListProps {
  transactions: Transaction[];
  categories: Category[];
  deleteTransaction: (id: number) => Promise<void>;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, categories, deleteTransaction }) => {
  const [showConfirmation, setShowConfirmation] = useState(0);

  const deleteTransactionAndCloseModal = (id: number) => {
    setShowConfirmation(0);
    deleteTransaction(id);
  };

  const renderLeftActions = (progress: any, dragX: any, transactionid: number) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton
        style={styles.leftAction}
        onPress={() => {
          setShowConfirmation(transactionid);
        }}>
        <Animated.Text style={[styles.actionText, { transform: [{ translateX: trans }] }]}>Delete</Animated.Text>
      </RectButton>
    );
  };

  return (
    <View style={{ gap: 15 }}>
      {transactions.map((transaction) => {
        const categoryForCurrentItem = categories.find((category) => category.id === transaction.category_id);
        return (
          <View key={transaction.id}>
            <Swipeable renderLeftActions={(progress, dragX) => renderLeftActions(progress, dragX, transaction.id)}>
              <TouchableOpacity key={transaction.id} activeOpacity={0.7} onLongPress={() => setShowConfirmation(transaction.id)}>
                <TransactionListItem transaction={transaction} categoryInfo={categoryForCurrentItem} />
              </TouchableOpacity>
            </Swipeable>
          </View>
        );
      })}
      <Modal visible={!!showConfirmation} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this transaction?</Text>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={() => setShowConfirmation(0)} color="#333" />
              <Button title="Delete" onPress={() => deleteTransactionAndCloseModal(showConfirmation)} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: "red",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5, // for Android shadow
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
export default TransactionsList;
