import React from "react";

import { Button, } from "@mui/material";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTranslation } from '../../../../../LocalizationContext';

import { UseLoader } from '../../../../../../App/LoaderContext';
import { UseNotification } from '../../../../../../App/NotificationContext';

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

interface ImageSenderProps {
    onLoad: (url: string) => void,
}

export default function ImageSender({ onLoad }: ImageSenderProps) {
    const { showNotification } = UseNotification();

    const { showLoader, hideLoader } = UseLoader();

    const { t } = useTranslation();

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
        showLoader()
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

            const url = response.result.url || "https://assets.usewaypoint.com/sample-image.jpg";
            onLoad(url);
        }
        catch (error) {
            console.log("Ошибка: ", error);
            showNotification(error.message);
        }
        finally {
            hideLoader();
        }
    }

    return (
        <>
            <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}>
                {t('fields.uploadFiles')}

                <VisuallyHiddenInput
                type="file"
                onChange={async (e) => {
                    await sendImage(e);
                }}
                />
            </Button>
        </>
    )
}