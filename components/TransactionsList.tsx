import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Category, Transaction } from "../types";
import TransactionListItem from "./TransactionListItem";

interface TransactionsListProps {
  transactions: Transaction[];
  categories: Category[];
  deleteTransaction: (id: number) => Promise<void>;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, categories, deleteTransaction }) => {
  return (
    <View style={{ gap: 15 }}>
      {transactions.map((transaction) => {
        const categoryForCurrentItem = categories.find((category) => category.id === transaction.category_id);
        return (
          <TouchableOpacity key={transaction.id} activeOpacity={0.7} onLongPress={() => deleteTransaction(transaction.id)}>
            <TransactionListItem transaction={transaction} categoryInfo={categoryForCurrentItem} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TransactionsList;
