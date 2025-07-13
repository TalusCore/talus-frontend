import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export const EditMode = ({
  newName,
  setNewName,
  handleEdit,
  handleClose
}: {
  newName: string;
  setNewName: (name: string) => void;
  handleEdit: () => void;
  handleClose: () => void;
}): React.JSX.Element => {
  return (
    <View>
      <Text style={modalModeStyles.modalTitle}>Rename</Text>
      <TextInput
        mode="outlined"
        label="Device Name"
        value={newName}
        onChangeText={setNewName}
        style={modalModeStyles.input}
        textColor="#333333"
        outlineColor="#333333"
        activeOutlineColor="#333333"
      />
      <View style={modalModeStyles.modalButtons}>
        <Button
          mode="contained"
          onPress={handleClose}
          style={modalModeStyles.button}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleEdit}
          style={modalModeStyles.button}
        >
          Save
        </Button>
      </View>
    </View>
  );
};

export const DeleteMode = ({
  name,
  handleDelete,
  handleClose
}: {
  name: string;
  handleDelete: () => void;
  handleClose: () => void;
}): React.JSX.Element => {
  return (
    <View>
      <Text style={modalModeStyles.modalTitle}>Confirm Deletion</Text>
      <Text style={modalModeStyles.modalText}>
        Are you sure you want to delete "{name}"?
      </Text>
      <View style={modalModeStyles.modalButtons}>
        <Button
          mode="contained"
          onPress={handleClose}
          style={modalModeStyles.button}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleDelete}
          style={modalModeStyles.button}
        >
          Delete
        </Button>
      </View>
    </View>
  );
};

const modalModeStyles = StyleSheet.create({
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333'
  },
  modalText: {
    fontSize: 16,
    color: '#333333'
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    marginLeft: 8
  }
});
