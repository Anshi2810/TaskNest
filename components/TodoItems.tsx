import { MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface Props {
  item: Todo;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
}

export default function TodoItem({
  item,
  onDelete,
  onToggle,
  onUpdate,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(item.title);

  const save = () => {
    if (!text.trim()) return;
    onUpdate(item.id, text);
    setEditing(false);
  };

  const cancel = () => {
    setText(item.title);
    setEditing(false);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => onToggle(item.id)}>
        <MaterialIcons
          name={item.completed ? "check-circle" : "radio-button-unchecked"}
          size={24}
          color={item.completed ? "#22c55e" : "#94a3b8"}
        />
      </TouchableOpacity>

      {editing ? (
        <TextInput
          value={text}
          onChangeText={setText}
          autoFocus
          onSubmitEditing={save}
          style={styles.input}
        />
      ) : (
        <Text
          style={[
            styles.text,
            item.completed && styles.completed,
          ]}
          onPress={() => !item.completed && setEditing(true)}
        >
          {item.title}
        </Text>
      )}

      <View style={styles.actions}>
        {editing ? (
          <>
            <TouchableOpacity onPress={save}>
              <MaterialIcons name="check" size={22} color="#22c55e" />
            </TouchableOpacity>
            <TouchableOpacity onPress={cancel}>
              <MaterialIcons name="close" size={22} color="#ef4444" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => !item.completed && setEditing(true)}
            >
              <MaterialIcons name="edit" size={22} color="#7c3aed" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item.id)}>
              <MaterialIcons name="delete" size={22} color="#ef4444" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 330,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  text: {
    flex: 1,
    marginHorizontal: 14,
    fontSize: 16,
    color: "#0f172a",
  },
  completed: {
    textDecorationLine: "line-through",
    color: "#94a3b8",
  },
  input: {
    flex: 1,
    marginHorizontal: 14,
    borderBottomWidth: 1,
    borderColor: "#cbd5f5",
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 14,
  },
});
