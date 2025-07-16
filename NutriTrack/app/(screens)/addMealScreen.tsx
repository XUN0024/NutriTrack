import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RouteGuard from '@/components/RouteGuard';

export default function AddMealScreen() {
  const colorScheme = useColorScheme();
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [search, setSearch] = useState('');
  
  // Mock data for food items that could be added to the meal
  const [selectedFoodItems, setSelectedFoodItems] = useState([
    { id: '1', name: 'Grilled Chicken Breast', quantity: 1, unit: 'serving', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { id: '2', name: 'Brown Rice', quantity: 1, unit: 'cup', calories: 216, protein: 5, carbs: 45, fat: 1.8 }
  ]);

  // Calculate total nutrition
  const totalNutrition = selectedFoodItems.reduce((acc, item) => {
    return {
      calories: acc.calories + item.calories * item.quantity,
      protein: acc.protein + item.protein * item.quantity,
      carbs: acc.carbs + item.carbs * item.quantity,
      fat: acc.fat + item.fat * item.quantity
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const handleSaveMeal = () => {
    // Save meal logic would go here
    console.log('Saving meal:', { mealName, mealType, selectedDate, selectedFoodItems });
    router.replace('/');
  };

  const handleRemoveItem = (id: string) => {
    setSelectedFoodItems(selectedFoodItems.filter(item => item.id !== id));
  };

  return (
    <RouteGuard>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.replace('/')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Meal</Text>
            <TouchableOpacity onPress={handleSaveMeal} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Meal Details Form */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Meal Details</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Meal Name</Text>
              <TextInput
                style={styles.input}
                value={mealName}
                onChangeText={setMealName}
                placeholder="Enter meal name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Meal Type</Text>
              <View style={styles.mealTypeContainer}>
                {mealTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.mealTypeButton,
                      mealType === type && styles.mealTypeButtonSelected
                    ]}
                    onPress={() => setMealType(type)}
                  >
                    <Text 
                      style={[
                        styles.mealTypeText,
                        mealType === type && styles.mealTypeTextSelected
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date & Time</Text>
              <TouchableOpacity style={styles.dateTimeButton}>
                <Text style={styles.dateTimeText}>
                  {selectedDate.toLocaleString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Food Items */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Food Items</Text>
              <View style={styles.cardHeaderButtons}>
                <TouchableOpacity style={styles.addItemButton}>
                  <Text style={styles.addItemButtonText}>+ Add Food</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createCustomButton}>
                  <Text style={styles.createCustomButtonText}>+ Create Custom Food</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
              <TextInput
                style={styles.searchBar}
                placeholder="Search food..."
                placeholderTextColor="#999"
                value={search}
                onChangeText={setSearch}
              />
            </View>
            {/* No results static message (for now) */}
            {search ? (
              <View style={styles.noResultContainer}>
                <Text style={styles.noResultText}>No food found. Try creating a custom food.</Text>
              </View>
            ) : null}
            {selectedFoodItems.map((item) => (
              <View key={item.id} style={styles.foodItem}>
                <View style={styles.foodItemDetails}>
                  <Text style={styles.foodItemName}>{item.name}</Text>
                  <View style={styles.foodItemMacros}>
                    <Text style={styles.foodItemMacroText}>{item.calories} cal</Text>
                    <Text style={styles.foodItemMacroText}>{item.protein}g protein</Text>
                    <Text style={styles.foodItemMacroText}>{item.carbs}g carbs</Text>
                    <Text style={styles.foodItemMacroText}>{item.fat}g fat</Text>
                  </View>
                </View>
                
                <View style={styles.foodItemActions}>
                  <View style={styles.quantityContainer}>
                    <TextInput
                      style={styles.quantityInput}
                      value={item.quantity.toString()}
                      keyboardType="numeric"
                      onChangeText={(value) => {
                        const newItems = [...selectedFoodItems];
                        const index = newItems.findIndex(i => i.id === item.id);
                        newItems[index] = { ...newItems[index], quantity: parseFloat(value) || 0 };
                        setSelectedFoodItems(newItems);
                      }}
                    />
                    <Text style={styles.unitText}>{item.unit}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF4040" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Nutrition Summary */}
            <View style={styles.nutritionSummary}>
              <Text style={styles.nutritionSummaryTitle}>Total Nutrition</Text>
              <View style={styles.nutritionValues}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                  <Text style={styles.nutritionValue}>{totalNutrition.calories}</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                  <Text style={styles.nutritionValue}>{totalNutrition.protein}g</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                  <Text style={styles.nutritionValue}>{totalNutrition.carbs}g</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                  <Text style={styles.nutritionValue}>{totalNutrition.fat}g</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButtonLarge} onPress={handleSaveMeal}>
            <Text style={styles.saveButtonLargeText}>Save Meal</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#22C55E',
    fontWeight: '600',
    fontSize: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  mealTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 4,
    marginBottom: 8,
  },
  mealTypeButtonSelected: {
    backgroundColor: '#22C55E',
  },
  mealTypeText: {
    color: '#666',
    fontWeight: '500',
  },
  mealTypeTextSelected: {
    color: 'white',
  },
  dateTimeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
  },
  addItemButton: {
    paddingVertical: 4,
  },
  addItemButtonText: {
    color: '#22C55E',
    fontWeight: '600',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  foodItemDetails: {
    flex: 1,
    paddingRight: 8,
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  foodItemMacros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  foodItemMacroText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  foodItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 40,
    textAlign: 'center',
  },
  unitText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 4,
  },
  nutritionSummary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  nutritionSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  nutritionValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonLarge: {
    backgroundColor: '#22C55E',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  saveButtonLargeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderButtons: {
    flexDirection: 'row',
  },
  createCustomButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginLeft: 8,
    marginBottom: 8,
  },
  createCustomButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  searchBarContainer: {
    marginBottom: 16,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
  },
  noResultContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noResultText: {
    color: '#999',
    fontSize: 14,
  },
}); 