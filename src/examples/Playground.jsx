import React from 'react';
import { DialogContent, DialogTitle,Dialog,Paper,Typography } from '@mui/material';
import { Container,Button } from '@mui/material';
import {createPortal} from 'react-dom';
const items = [
  {
    id: 1,
    title: 'Modal 1'
  },
  {
    id: 2,
    title: 'Modal 2'
  },
  {
    id: 3,
    title: 'Modal 3'
  },
  {
    id: 4,
    title: 'Modal 4'
  }
]


export default function Playground() {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const onModalToggle = (evt, id) => {
    console.log('onModalToggle')
    setModalOpen(!isModalOpen);
  }
  const [modalOpen, setModal] = React.useState(false);

  const openModal = event => {
    console.log('open modal',event);
    event.preventDefault();
    const {
      target: {
        dataset: { modal }
      }
    } = event;
    if (modal) setModal(modal);
  };

  const closeModal = () => {
    console.log('close modal');
    setModal('');
  };

  return(
    <>
      <Paper sx={{
        marginTop: 25,
        border:1,

      }}>
        <Container>
          <div id="app-root"></div>
          <div id="modal-root">
            <div id="modal-1">Modal 1</div>"
          </div>
          <h2>Test Modals</h2>
          <ModalManager closeFn={closeModal} modal={modalOpen} />
    
          {items.map((item,idx)=>{
            return(
              <div key={item+'_'+idx}>
                <Button onClick={openModal} data-modal={`model-${idx}`} >Open Modal {idx}</Button>
                
                {/* <TestModal closeFn={closeModal} open={modal === 'modal-one'}></TestModal> */}
                {/* <Modal closeFn={closeModal} open={modalOpen ===`modal-${idx}`} title="Modal 1" /> */}
              </div>
              )
          })}
        </Container>
      </Paper>
    </>
  )
  // return (
  //   <>
  //     <Container sx={{
  //       marginTop: 25,
  //     }}>
  //       <div id="modal-root">Modal Root</div>
  //       {items.map((item) => (
  //         <div key={item.id+'_' + item.title}>
  //           <Modal isOpen={isModalOpen} handleClose={(evt) => onModalToggle(evt,item.id)} title={item.title} />
  //           <Button onClick={(evt) => onModalToggle(evt, item.id)}>
  //               Show Modal {item.id}
  //           </Button></div>
  //       ))}
  //     </Container>
  //   </>
  // )

}


export function TestModal(props){
  console.log(`🚀 ~ file: Playground.jsx:48 ~ Modal ~ props:`, props);

  const {open,title,handleClose} = props;
  return(
  <Dialog open={open} onClose={handleClose}>
    <DialogContent>
      {title}
    </DialogContent>
  </Dialog>
);
}

const modalRootEl = document.getElementById('modal-root')
const Modal = ({
  children,
  open = false
}) => {
  console.log('modal called',children)
  if (!open) return null

  return createPortal(children, modalRootEl)
}


const ModalManager = ({ closeFn, modal = '' }) => {
  return (
    <>
      <TestModal closeFn={closeFn} open={modal === 'modal-one'} />
      <TestModal closeFn={closeFn} open={modal === 'modal-two'} />
      <TestModal closeFn={closeFn} open={modal === 'modal-three'} />
    </>
  );
};
