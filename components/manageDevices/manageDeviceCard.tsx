import { deleteTalus, renameTalus } from '@/api/talusApi';
import { updateTalusOptions } from '@/api/userApi';
import { AuthContext } from '@/contexts/AuthContext';
import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import ModalPopUp from '../modalPopUp';
import type { Talus } from '../types';
import { DeleteMode, EditMode } from './modalModes';

type ManageDeviceCardProps = Talus & {
  setTalusOptions: (taluses: Talus[]) => void;
};

const ManageDeviceCard = ({
  name,
  talusId,
  setTalusOptions
}: ManageDeviceCardProps): React.JSX.Element => {
  const { user, talus, setMostRecentTalus } = useContext(AuthContext);
  const [modalMode, setModalMode] = useState<'edit' | 'delete' | null>(null);
  const [newName, setNewName] = useState('');

  const handleTalusChange = (): void => {
    if (talusId === talus?.talusId) {
      setMostRecentTalus();
    }

    updateTalusOptions(user, setTalusOptions);
  };

  const handleRenameSubmit = (): void => {
    if (newName.trim() === '') {
      console.error('Device name cannot be empty');
      return;
    }

    renameTalus(talusId, newName)
      .then(response => {
        if (response.success) {
          handleTalusChange();
        } else {
          console.error(response.error);
        }
      })
      .catch(error => {
        console.error('Error renaming device:', error);
      });

    handleClose();
  };

  const handleDeleteConfirm = (): void => {
    deleteTalus(talusId)
      .then(response => {
        if (response.success) {
          handleTalusChange();
        } else {
          console.error(response.error);
        }
      })
      .catch(error => {
        console.error('Error deleting device:', error);
      });

    handleClose();
  };

  const handleClose = (): void => {
    setModalMode(null);
    setNewName('');
  };

  return (
    <>
      <Card style={manageDeviceStyles.card}>
        <View style={manageDeviceStyles.row}>
          <Text style={manageDeviceStyles.deviceName}>{name}</Text>
          <View style={manageDeviceStyles.actions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => setModalMode('edit')}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => setModalMode('delete')}
              iconColor="red"
            />
          </View>
        </View>
      </Card>
      <ModalPopUp visible={modalMode !== null} handleClose={handleClose}>
        {modalMode === 'edit' && (
          <EditMode
            newName={newName}
            setNewName={setNewName}
            handleEdit={handleRenameSubmit}
            handleClose={handleClose}
          />
        )}

        {modalMode === 'delete' && (
          <DeleteMode
            name={name}
            handleDelete={handleDeleteConfirm}
            handleClose={handleClose}
          />
        )}
      </ModalPopUp>
    </>
  );
};

const manageDeviceStyles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 2,
    backgroundColor: '#333333'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-between'
  },
  deviceName: {
    fontSize: 16,
    color: '#ffffff'
  },
  actions: {
    flexDirection: 'row'
  }
});

export default ManageDeviceCard;
