import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Filter = "ALL" | "ACTIVE" | "COMPLETED";

interface Props {
  active: Filter;
  onChange: (filter: Filter) => void;
}

export default function FilterTabs({ active, onChange }: Props) {
  const tabs: Filter[] = ["ALL", "ACTIVE", "COMPLETED"];

  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            active === tab && styles.activeTab,
          ]}
          onPress={() => onChange(tab)}
        >
          <Text
            style={[
              styles.text,
              active === tab && styles.activeText,
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flexDirection: "row",
  marginVertical: 15,
  marginHorizontal:20,
  gap: 10,
  width: "100%",              // 👈 full width
},

  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#1e293b",
  },
  activeTab: {
    backgroundColor: "#2563eb",
  },
  text: {
    color: "#cbd5f5",
    fontSize: 14,
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
});
