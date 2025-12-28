import React, { useEffect, useState } from 'react';

import { Backdrop, CircularProgress, Stack, useTheme } from '@mui/material';

import { useInspectorDrawerOpen, useSamplesDrawerOpen } from '../documents/editor/EditorContext';

import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from './InspectorDrawer';
// import SamplesDrawer, { SAMPLES_DRAWER_WIDTH } from './SamplesDrawer';
import TemplatePanel from './TemplatePanel';
import { UseLoader } from './LoaderContext';

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

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    (window as any).showEmailBuilder = () => setIsVisible(true);
    (window as any).hideEmailBuilder = () => setIsVisible(false);
  }, [])

  if (!isVisible) return null;

  return (
    <>
      <Backdrop 
        sx={{zIndex: 999999}}
        open={ isLoading }>
        <CircularProgress color="inherit" />
      </Backdrop>

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
