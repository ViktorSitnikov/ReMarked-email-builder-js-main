import React, { useEffect, useState } from 'react';

import { Backdrop, CircularProgress, Stack, useTheme, Modal, Box } from '@mui/material';

import { resetDocument, useInspectorDrawerOpen, useSamplesDrawerOpen } from '../documents/editor/EditorContext';

import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from './InspectorDrawer';
// import SamplesDrawer, { SAMPLES_DRAWER_WIDTH } from './SamplesDrawer';
import TemplatePanel from './TemplatePanel';
import { UseLoader } from './LoaderContext';

import { UseNotification } from './NotificationContext';
import validateJsonStringValue from './TemplatePanel/ImportJson/validateJsonStringValue';

function useDrawerTransition(cssProperty: 'margin-left' | 'margin-right', open: boolean) {
  const { transitions } = useTheme();
  return transitions.create(cssProperty, {
    easing: !open ? transitions.easing.sharp : transitions.easing.easeOut,
    duration: !open ? transitions.duration.leavingScreen : transitions.duration.enteringScreen,
  });
}

export default function App() {
  
  const inspectorDrawerOpen = useInspectorDrawerOpen();
  // const samplesDrawerOpen = useSamplesDrawerOpen();

  // const marginLeftTransition = useDrawerTransition('margin-left', samplesDrawerOpen);
  const marginRightTransition = useDrawerTransition('margin-right', inspectorDrawerOpen);

  const { isLoading } = UseLoader();

  const { message, hideNotification } = UseNotification();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    (window as any).showEmailBuilder = () => {

      const targetTemplateTextareaEl = document.getElementById("messageTemplateJson") as HTMLTextAreaElement | null;

      if (targetTemplateTextareaEl && targetTemplateTextareaEl.value) {
        const { error, data } = validateJsonStringValue(targetTemplateTextareaEl.value);

        resetDocument(data);
      }

      setIsVisible(true);
    };
    (window as any).hideEmailBuilder = () => setIsVisible(false);
  }, [])

  if (!isVisible) return null;

  const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 2,
    };

  return (
    <>
      <Backdrop 
        sx={{zIndex: 999999}}
        open={ isLoading }>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Modal
        open={message != undefined}
        onClose={() => {
          hideNotification();
        }}>
        <Box sx={style}>
          <span>Возникла ошибка:</span><br/>
          <span>{message}</span>
        </Box>
      </Modal>

      <InspectorDrawer />
      {/* <SamplesDrawer /> */}

      <Stack
        sx={{
          marginRight: inspectorDrawerOpen ? `${INSPECTOR_DRAWER_WIDTH}px` : 0,
          /* marginLeft: samplesDrawerOpen ? `${SAMPLES_DRAWER_WIDTH}px` : 0, */
          /* transition: [marginLeftTransition, marginRightTransition].join(', '), */
          transition: [marginRightTransition].join(', '),
        }}
      >
        <TemplatePanel />
      </Stack>
    </>
  );
}
