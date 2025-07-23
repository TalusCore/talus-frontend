import { StyleSheet, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';

const ModalPopUp = ({
  children,
  visible,
  handleClose
}: {
  children: React.ReactNode;
  visible: boolean;
  handleClose: () => void;
}): React.JSX.Element => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={modalPopUpStyles.modalContainer}
      >
        <View style={modalPopUpStyles.innerContainer}>{children}</View>
      </Modal>
    </Portal>
  );
};

const modalPopUpStyles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    margin: 20,
    maxHeight: '80%'
  }
});

export default ModalPopUp;
