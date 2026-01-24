import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import FilterTabs from "../components/FilterTabs";
import TodoItem from "../components/TodoItems";

/* Enable animations on Android */
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

type Filter = "ALL" | "ACTIVE" | "COMPLETED";

const STORAGE_KEY = "TODO_LIST";

export default function Index() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [loading, setLoading] = useState(true);

  /* Load Todos */
  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setTodos(JSON.parse(data));
      setLoading(false);
    };
    load();
  }, []);

  /* Save Todos */
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, loading]);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "ACTIVE") return !todo.completed;
    if (filter === "COMPLETED") return todo.completed;
    return true;
  });

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const addTodo = () => {
    if (!task.trim()) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTodos([
      ...todos,
      { id: Date.now().toString(), title: task, completed: false },
    ]);
    setTask("");
  };

  const deleteTodo = (id: string) => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setTodos(todos.filter((t) => t.id !== id));
        },
      },
    ]);
  };

  const toggleTodo = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const updateTodo = (id: string, title: string) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, title } : t)));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Loading…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={styles.container}>
        {/* Header */}
        <View>
          <Text style={styles.head}>TaskNest</Text>
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>Goals</Text>
          <Text style={styles.subtitle}>{percentage}% completed</Text>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${percentage}%` }]} />
          </View>
        </View>

        {/* Input */}
        <View style={styles.inputCard}>
          <TextInput
            placeholder="What do you need to do?"
            placeholderTextColor="#94a3b8"
            value={task}
            onChangeText={setTask}
            style={styles.input}
            onSubmitEditing={addTodo}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addTodo}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>

        <FilterTabs active={filter} onChange={setFilter} />

        {/* List */}
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoItem
              item={item}
              onDelete={deleteTodo}
              onToggle={toggleTodo}
              onUpdate={updateTodo}
            />
          )}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: 140,
            alignItems: "center",
          }}
          ListEmptyComponent={<Text style={styles.empty}>No tasks yet</Text>}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#0f172a",
    letterSpacing: 0.3,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748b",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 10,
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#7c3aed",
  },
  inputCard: {
    marginHorizontal: 20,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  input: {
    fontSize: 18,
    paddingVertical: 10,
    color: "#0f172a",
  },
  addBtn: {
    marginTop: 12,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
  },
  addText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.4,
  },
  empty: {
    marginTop: 40,
    fontSize: 15,
    color: "#64748b",
  },
  head: {
    fontSize: 30,
    fontWeight: "700",
    color: "#7c3aed",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
    fontFamily: "oswald-bold",
  },
});
