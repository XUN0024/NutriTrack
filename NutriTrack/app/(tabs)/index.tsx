import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  
  // Mock data for the dashboard
  const dailySummary = {
    calories: {
      consumed: 1250,
      goal: 2100,
      remaining: 850
    },
    macros: {
      carbs: { consumed: 145, goal: 240, unit: 'g' },
      protein: { consumed: 85, goal: 120, unit: 'g' },
      fat: { consumed: 40, goal: 70, unit: 'g' }
    },
    water: { consumed: 4, goal: 8, unit: 'glasses' }
  };

  const recentMeals = [
    { id: 1, name: 'Breakfast', time: '7:30 AM', calories: 420, items: ['Oatmeal with berries', 'Greek yogurt'] },
    { id: 2, name: 'Lunch', time: '12:15 PM', calories: 580, items: ['Grilled chicken salad', 'Whole grain bread'] },
    { id: 3, name: 'Snack', time: '3:30 PM', calories: 250, items: ['Apple', 'Almonds (1oz)'] }
  ];

  const renderProgressBar = (consumed: number, goal: number) => {
    const percentage = Math.min(Math.round((consumed / goal) * 100), 100);
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%` }]} />
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* Header with date */}
      <View style={styles.header}>
        <Text style={styles.date}>{today}</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/addMealScreen')}
        >
          <Text style={styles.addButtonText}>+ Add Food</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Summary Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Summary</Text>
        
        {/* Calories */}
        <View style={styles.calorieContainer}>
          <View style={styles.calorieItem}>
            <Text style={styles.calorieLabel}>Consumed</Text>
            <Text style={styles.calorieValue}>{dailySummary.calories.consumed}</Text>
          </View>
          <View style={styles.calorieItem}>
            <Text style={styles.calorieLabel}>Goal</Text>
            <Text style={styles.calorieValue}>{dailySummary.calories.goal}</Text>
          </View>
          <View style={styles.calorieItem}>
            <Text style={styles.calorieLabel}>Remaining</Text>
            <Text style={[styles.calorieValue, { color: '#22C55E' }]}>{dailySummary.calories.remaining}</Text>
          </View>
        </View>
        
        {renderProgressBar(dailySummary.calories.consumed, dailySummary.calories.goal)}
        
        {/* Macros */}
        <View style={styles.macrosContainer}>
          <Text style={styles.sectionTitle}>Macros</Text>
          
          {/* Carbs */}
          <View style={styles.macroRow}>
            <View style={styles.macroLabelContainer}>
              <View style={[styles.macroIndicator, { backgroundColor: '#4AADF9' }]} />
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <Text style={styles.macroValue}>
              {dailySummary.macros.carbs.consumed} / {dailySummary.macros.carbs.goal} {dailySummary.macros.carbs.unit}
            </Text>
          </View>
          {renderProgressBar(dailySummary.macros.carbs.consumed, dailySummary.macros.carbs.goal)}
          
          {/* Protein */}
          <View style={styles.macroRow}>
            <View style={styles.macroLabelContainer}>
              <View style={[styles.macroIndicator, { backgroundColor: '#E74C3C' }]} />
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <Text style={styles.macroValue}>
              {dailySummary.macros.protein.consumed} / {dailySummary.macros.protein.goal} {dailySummary.macros.protein.unit}
            </Text>
          </View>
          {renderProgressBar(dailySummary.macros.protein.consumed, dailySummary.macros.protein.goal)}
          
          {/* Fat */}
          <View style={styles.macroRow}>
            <View style={styles.macroLabelContainer}>
              <View style={[styles.macroIndicator, { backgroundColor: '#F1C40F' }]} />
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
            <Text style={styles.macroValue}>
              {dailySummary.macros.fat.consumed} / {dailySummary.macros.fat.goal} {dailySummary.macros.fat.unit}
            </Text>
          </View>
          {renderProgressBar(dailySummary.macros.fat.consumed, dailySummary.macros.fat.goal)}
        </View>
        
        {/* Water intake */}
        <View style={styles.waterContainer}>
          <Text style={styles.sectionTitle}>Water Intake</Text>
          <View style={styles.waterTracker}>
            {Array.from({ length: dailySummary.water.goal }).map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.waterGlass, 
                  index < dailySummary.water.consumed ? styles.waterGlassFilled : null
                ]}
              />
            ))}
          </View>
          <Text style={styles.waterText}>
            {dailySummary.water.consumed} of {dailySummary.water.goal} glasses
          </Text>
        </View>
      </View>

      {/* Recent Meals */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Meals</Text>
        
        {recentMeals.map(meal => (
          <TouchableOpacity key={meal.id} style={styles.mealItem}>
            <View style={styles.mealHeader}>
              <View>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
              <Text style={styles.mealCalories}>{meal.calories} cal</Text>
            </View>
            
            <View style={styles.mealDetails}>
              {meal.items.map((item, index) => (
                <Text key={index} style={styles.mealDetailText}>• {item}</Text>
              ))}
            </View>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity 
          style={styles.addMealButton}
          onPress={() => router.push('/addMealScreen')}
        >
          <Text style={styles.addMealButtonText}>+ Add Meal</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionText}>Track Weight</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionText}>Track Exercise</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  calorieContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calorieItem: {
    alignItems: 'center',
  },
  calorieLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  calorieValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },
  macrosContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  macroLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  macroLabel: {
    fontSize: 14,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  waterContainer: {
    marginTop: 20,
  },
  waterTracker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
  },
  waterGlass: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E5E5',
    margin: 4,
  },
  waterGlassFilled: {
    backgroundColor: '#4AADF9',
  },
  waterText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  mealItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
  },
  mealTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '500',
  },
  mealDetails: {
    marginTop: 8,
  },
  mealDetailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  addMealButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  addMealButtonText: {
    color: '#22C55E',
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionText: {
    fontWeight: '600',
    color: '#22C55E',
  },
});
