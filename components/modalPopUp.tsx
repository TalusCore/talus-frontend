import { StyleSheet } from 'react-native';
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
        contentContainerStyle={modalPopUpStyles.innerContainer}
      >
        {children}
      </Modal>
    </Portal>
  );
};

const modalPopUpStyles = StyleSheet.create({
  innerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    margin: 20,
    overflow: 'hidden'
  }
});

export default ModalPopUp;
