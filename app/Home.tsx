import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Keyboard,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// SVG Icons as components
const MoonIcon = () => (
  <View style={styles.iconContainer}>
    <Text style={styles.moonIcon}>🌙</Text>
  </View>
);

const SunIcon = () => (
  <View style={styles.iconContainer}>
    <Text style={styles.sunIcon}>☀️</Text>
  </View>
);

const CheckIcon = () => (
  <View style={styles.checkIcon}>
    <Text style={styles.checkText}>✓</Text>
  </View>
);

const CloseIcon = () => <Text style={styles.closeIcon}>✕</Text>;

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [todos, setTodos] = useState([
    { id: "1", text: "Complete online JavaScript course", completed: true },
    { id: "2", text: "Jog around the park 3x", completed: false },
    { id: "3", text: "10 minutes meditation", completed: false },
    { id: "4", text: "Read for 1 hour", completed: false },
    { id: "5", text: "Pick up groceries", completed: false },
    { id: "6", text: "Complete Todo App on Frontend Mentor", completed: false },
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const theme = isDark ? darkTheme : lightTheme;

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text: newTodo,
          completed: false,
        },
      ]);
      setNewTodo("");
      Keyboard.dismiss();
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const moveTodo = (fromIndex, toIndex) => {
    const newTodos = [...todos];
    const [movedItem] = newTodos.splice(fromIndex, 1);
    newTodos.splice(toIndex, 0, movedItem);
    setTodos(newTodos);
  };

  const getFilteredTodos = () => {
    let filtered = todos;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((todo) =>
        todo.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filter === "active") {
      return filtered.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      return filtered.filter((todo) => todo.completed);
    }
    return filtered;
  };

  const filteredTodos = getFilteredTodos();
  const itemsLeft = todos.filter((todo) => !todo.completed).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Background */}
      <View style={[styles.headerBg, { backgroundColor: theme.headerBg }]}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>TODO</Text>
          <TouchableOpacity onPress={() => setIsDark(!isDark)}>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Input Section */}
        <View
          style={[styles.inputContainer, { backgroundColor: theme.cardBg }]}
        >
          <View style={styles.checkCircle} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Create a new todo..."
            placeholderTextColor={theme.placeholder}
            value={newTodo}
            onChangeText={setNewTodo}
            onSubmitEditing={addTodo}
            returnKeyType="done"
          />
        </View>

        {/* Search Bar */}
        <View
          style={[styles.searchContainer, { backgroundColor: theme.cardBg }]}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search todos..."
            placeholderTextColor={theme.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Todo List Card */}
        <View style={[styles.todoCard, { backgroundColor: theme.cardBg }]}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.textLight }]}>
                Loading todos...
              </Text>
            </View>
          ) : filteredTodos.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                {searchQuery
                  ? "No todos found"
                  : filter === "completed"
                    ? "No completed todos"
                    : filter === "active"
                      ? "No active todos"
                      : "No todos yet"}
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textLight }]}>
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first todo to get started"}
              </Text>
            </View>
          ) : (
            filteredTodos.map((todo, index) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                theme={theme}
                onToggle={() => toggleTodo(todo.id)}
                onDelete={() => deleteTodo(todo.id)}
                index={index}
                onMove={moveTodo}
                totalItems={filteredTodos.length}
              />
            ))
          )}

          {/* Footer */}
          {filteredTodos.length > 0 && (
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.textLight }]}>
                {itemsLeft} items left
              </Text>
              <TouchableOpacity onPress={clearCompleted}>
                <Text style={[styles.footerText, { color: theme.textLight }]}>
                  Clear Completed
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Filter Buttons */}
        <View
          style={[styles.filterContainer, { backgroundColor: theme.cardBg }]}
        >
          <TouchableOpacity onPress={() => setFilter("all")}>
            <Text
              style={[
                styles.filterText,
                { color: filter === "all" ? theme.primary : theme.textLight },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter("active")}>
            <Text
              style={[
                styles.filterText,
                {
                  color: filter === "active" ? theme.primary : theme.textLight,
                },
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter("completed")}>
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    filter === "completed" ? theme.primary : theme.textLight,
                },
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.dragHint, { color: theme.textLight }]}>
          Drag and drop to reorder list
        </Text>
      </ScrollView>
    </View>
  );
}

// TodoItem Component with drag functionality
function TodoItem({
  todo,
  theme,
  onToggle,
  onDelete,
  index,
  onMove,
  totalItems,
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: (evt, gestureState) => {
        pan.setValue({ x: 0, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        setIsDragging(false);
        const moveThreshold = 60;

        if (gestureState.dy < -moveThreshold && index > 0) {
          onMove(index, index - 1);
        } else if (gestureState.dy > moveThreshold && index < totalItems - 1) {
          onMove(index, index + 1);
        }

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.todoItem,
        {
          borderBottomColor: theme.border,
          transform: pan.getTranslateTransform(),
          opacity: isDragging ? 0.7 : 1,
          elevation: isDragging ? 5 : 0,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={[
          styles.checkbox,
          todo.completed && styles.checkboxChecked,
          todo.completed && {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
          },
        ]}
        onPress={onToggle}
      >
        {todo.completed && <CheckIcon />}
      </TouchableOpacity>
      <Text
        style={[
          styles.todoText,
          { color: theme.text },
          todo.completed && styles.todoTextCompleted,
          todo.completed && { color: theme.textLight },
        ]}
      >
        {todo.text}
      </Text>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <CloseIcon />
      </TouchableOpacity>
    </Animated.View>
  );
}

const lightTheme = {
  background: "#fafafa",
  headerBg: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
  cardBg: "#ffffff",
  text: "#494c6b",
  textLight: "#9495a5",
  border: "#e3e4f1",
  placeholder: "#9495a5",
  primary: "#3a7bfd",
};

const darkTheme = {
  background: "#171823",
  headerBg: "linear-gradient(135deg, #5b21b6 0%, #6b21a8 100%)",
  cardBg: "#25273d",
  text: "#c8cbe7",
  textLight: "#5b5e7e",
  border: "#393a4b",
  placeholder: "#767992",
  primary: "#3a7bfd",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBg: {
    height: 200,
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 12,
  },
  iconContainer: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  moonIcon: {
    fontSize: 20,
  },
  sunIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
    marginTop: -120,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 5,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 3,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e3e4f1",
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 5,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  clearSearch: {
    fontSize: 14,
    color: "#9495a5",
    padding: 4,
  },
  todoCard: {
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 3,
    marginBottom: 16,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e3e4f1",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    background: "linear-gradient(135deg, #55ddff 0%, #c058f3 100%)",
  },
  checkIcon: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  checkText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  todoText: {
    flex: 1,
    fontSize: 14,
  },
  todoTextCompleted: {
    textDecorationLine: "line-through",
  },
  deleteBtn: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 14,
    color: "#9495a5",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
    paddingVertical: 16,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 3,
    marginBottom: 16,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 4,
  },
  dragHint: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 24,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyState: {
    paddingVertical: 60,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
});
