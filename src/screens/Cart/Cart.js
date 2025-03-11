import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import BottomTab from "../../components/BottomTab/BottomTab";
import { SafeAreaView } from "react-native-safe-area-context";

const CartScreen = () => {
  const navigation = useNavigation()
  const [cartItems, setCartItems] = useState([]);
  const theme = useColorScheme();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem("cart");
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };
    loadCart();
  }, []);

  const saveCart = async (updatedCart) => {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const handleQuantityChange = (id, type) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
        : item
    );
    saveCart(updatedCart);
  };

  const handleDeleteItem = (id) => {
    Alert.alert("Remove Item", "Are you sure you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        onPress: () => {
          const updatedCart = cartItems.filter((item) => item.id !== id);
          saveCart(updatedCart);
        },
      },
    ]);
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const styles = getStyles(theme);

  return (

    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image_full_url }} style={styles.productImage} />
            <View style={styles.detailsContainer}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={22} color="red" />
                </TouchableOpacity>
                <View style={styles.quantityControl}>
                  <TouchableOpacity onPress={() => handleQuantityChange(item.id, "decrease")}>
                    <FontAwesome name="minus-circle" size={22} color="green" />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => handleQuantityChange(item.id, "increase")}>
                    <FontAwesome name="plus-circle" size={22} color="green" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyCart}>Your cart is empty</Text>}
      />

      <TouchableOpacity style={styles.addMoreBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.addMoreText}>+ Add More Items</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.subtotalText}>Subtotal:</Text>
        <Text style={styles.subtotalPrice}>${subtotal.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.confirmBtn}>
        <Text style={styles.confirmText}>Confirm Delivery Details</Text>
      </TouchableOpacity>
      <BottomTab />
    </View>



  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#121212" : "transparent",
      padding: 10
    },
    cartItem: {
      flexDirection: "row",
      backgroundColor: theme === "dark" ? "#1E1E1E" : "#fff",
      padding: 10,
      marginVertical: 5,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
      alignItems: "center",
    },
    productImage: { width: 80, height: 80, borderRadius: 10 },
    detailsContainer: { flex: 1, marginLeft: 15 },
    productName: { fontSize: 16, fontWeight: "bold", color: theme === "dark" ? "#fff" : "#000" },
    price: { fontSize: 14, fontWeight: "bold", color: theme === "dark" ? "#ccc" : "#333" },
    actions: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
    deleteButton: { padding: 5 },
    quantityControl: { flexDirection: "row", alignItems: "center" },
    quantity: { fontSize: 16, fontWeight: "bold", marginHorizontal: 10, color: theme === "dark" ? "#fff" : "#000" },
    addMoreBtn: { marginVertical: 10, padding: 10, borderRadius: 5, backgroundColor: "#f8f8f8", alignItems: "center" },
    addMoreText: { fontSize: 16, color: "green", fontWeight: "bold" },
    footer: { flexDirection: "row", justifyContent: "space-between", padding: 10, borderTopWidth: 1, borderColor: "#ddd" },
    subtotalText: { fontSize: 16, fontWeight: "bold", color: theme === "dark" ? "#fff" : "#000" },
    subtotalPrice: { fontSize: 16, fontWeight: "bold", color: theme === "dark" ? "#ccc" : "#333" },
    confirmBtn: { backgroundColor: "green", padding: 15, borderRadius: 5, alignItems: "center", marginTop: 10 },
    confirmText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
    emptyCart: { textAlign: "center", marginTop: 50, fontSize: 16, color: theme === "dark" ? "#888" : "#888" },
  });

export default CartScreen;