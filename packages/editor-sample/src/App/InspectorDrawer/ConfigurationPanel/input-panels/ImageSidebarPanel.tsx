import React, { useState } from 'react';

import {
  VerticalAlignBottomOutlined,
  VerticalAlignCenterOutlined,
  VerticalAlignTopOutlined,
} from '@mui/icons-material';
import { Stack, ToggleButton, Button } from '@mui/material';
import { ImageProps, ImagePropsSchema } from '@usewaypoint/block-image';

import { useTranslation } from '../../../LocalizationContext';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextDimensionInput from './helpers/inputs/TextDimensionInput';
import TextInput from './helpers/inputs/TextInput';
import ImagePicker from './helpers/inputs/ImagePicker';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';
import { styled } from '@mui/material/styles';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

type ImageSidebarPanelProps = {
  data: ImageProps;
  setData: (v: ImageProps) => void;
};

export default function ImageSidebarPanel({ data, setData }: ImageSidebarPanelProps) {
  const { t } = useTranslation();
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateData = (d: unknown) => {
    const res = ImagePropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const readFileAsBase64 = async (file: File) : Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        
        reader.readAsDataURL(file as Blob);
    });
  }

  const getFileExtension = (fileName: string) : string => {
    return fileName.split(".").pop() || "";
  };

  const removeFileExtension = (fileName: string) : string => {
    return fileName.split(".")[0].toLowerCase();
  }

  const sendImage = async (e:React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0] as File;

      if (!file) return;

      // Читаем файл как base64
        const base64String = await readFileAsBase64(file);
        
        // Извлекаем чистую часть base64 (без префикса)
        const cleanBase64 = base64String.replace(/^data:.*;base64,/, '');
        
        // Получаем расширение файла
        const fileExtension = getFileExtension(file.name);
        
        const requestData = {
            "jsonrpc": "2.0",
            "method": "FilesLoading.LoadingFile",
            "id": Date.now(),
            "params": {
                "file_name": removeFileExtension(file.name),
                "file_type": fileExtension,
                "file": cleanBase64,
                "file_size": file.size,
            }
        };
        
        const request = await fetch(`/${(window as any)?.appOptions?.point || 555222}/api`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(requestData)
        });

        const response = await request.json();

        const url = response.result.url || "https://sun9-1.userapi.com/s/v1/ig2/y84MOBSfIOtEsP-auhsgG9aZDrRC-tm-_vL3Mi9hAVLzAp2QAG1kifBLnn77pOozPvOXXeATMBzJ92lW_2ffDKI6.jpg?quality=95&as=32x18,48x27,72x40,108x61,160x90,240x135,360x202,480x270,540x304,640x360,720x405,1080x607,1280x720,1440x810,2560x1440&from=bu&cs=2560x0";
        updateData({ ...data, props: { ...data.props, url } });
    }
    catch (e) {
      console.log("Ошибка: ",e);
    }
  }


  return (
    <BaseSidebarPanel title={t('panels.image')}>
      <TextInput
        label={t('fields.sourceUrl')}
        defaultValue={data.props?.url ?? ''}
        onChange={(v) => {
          const url = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, url } });
        }}
      />

      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        {t('fields.uploadFiles')}
        <VisuallyHiddenInput
          type="file"
          onChange={async (e) => {
            await sendImage(e);
          }}
        />
      </Button>

      <Button 
        style={{marginTop: 10}}
        variant="contained" 
        onClick={() => {
          setIsModalOpen(true)
        }}>
          {t("fields.chooseImage")}
      </Button>

      <ImagePicker 
        isOpen={ isModalOpen }
        onClose={() => setIsModalOpen(false)}
        onSelect={(url) => {
          updateData({ ...data, props: { ...data.props, url } });
        }} />

      <TextInput
        label={t('fields.altText')}
        defaultValue={data.props?.alt ?? ''}
        onChange={(alt) => updateData({ ...data, props: { ...data.props, alt } })}
      />
      <TextInput
        label={t('fields.clickThroughUrl')}
        defaultValue={data.props?.linkHref ?? ''}
        onChange={(v) => {
          const linkHref = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, linkHref } });
        }}
      />
      <Stack direction="row" spacing={2}>
        <TextDimensionInput
          label={t('fields.width')}
          defaultValue={data.props?.width}
          onChange={(width) => updateData({ ...data, props: { ...data.props, width } })}
        />
        <TextDimensionInput
          label={t('fields.height')}
          defaultValue={data.props?.height}
          onChange={(height) => updateData({ ...data, props: { ...data.props, height } })}
        />
      </Stack>

      <RadioGroupInput
        label={t('fields.alignment')}
        defaultValue={data.props?.contentAlignment ?? 'middle'}
        onChange={(contentAlignment) => updateData({ ...data, props: { ...data.props, contentAlignment } })}
      >
        <ToggleButton value="top">
          <VerticalAlignTopOutlined fontSize="small" />
        </ToggleButton>
        <ToggleButton value="middle">
          <VerticalAlignCenterOutlined fontSize="small" />
        </ToggleButton>
        <ToggleButton value="bottom">
          <VerticalAlignBottomOutlined fontSize="small" />
        </ToggleButton>
      </RadioGroupInput>

      <MultiStylePropertyPanel
        names={['backgroundColor', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
