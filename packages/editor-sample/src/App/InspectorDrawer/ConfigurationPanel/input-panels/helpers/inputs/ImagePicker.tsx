import React, { useState, useEffect } from "react";

import { Backdrop, Box, CircularProgress, ImageList, ImageListItem, Modal } from "@mui/material";
import { UseNotification } from '../../../../../../App/NotificationContext';

interface ReservedImage{
    id: number,
    url: string,
    name: string,
}

interface ReservedImages{
    result: ReservedImage[];
}

interface ImagePickerProps{
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

export default function ImagePicker({ isOpen, onClose, onSelect }: ImagePickerProps) {
    const { showNotification } = UseNotification();

    const [images, setImages] = useState<ReservedImage[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && images.length == 0) {
            setLoading(true);

            const fetchImages = async () => {    
                try {
                    let response = await fetch(`/${(window as any).appOptions.point || 555222}/api`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify({
                            "jsonrpc": "2.0",
                            "method": "FilesLoading.GetHistory",
                            "id": Date.now(),
                        })
                    });

                    

                    const data: ReservedImages = await response.json();

                    if (data.result) {
                        const securedImages = data.result.map((reservedImg) => ({
                            ...reservedImg, url: `https:${reservedImg.url.split(":").pop()}`
                        }));

                        setImages(securedImages);
                    }

                }
                catch (e) {
                    console.log(e);
                    onClose();
                    showNotification(e.message);

                }
                finally {
                    setLoading(false);
                }
            }

            fetchImages();
        }
    }, [isOpen]);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "calc(30vw - 10px)",
        height: "90vh",
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 2,
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-modal-title"

        >
            <Box sx={style}>
                <Backdrop 
                    sx={{zIndex: 999999, background: "#222"}}
                    open={ loading }>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <ImageList variant="masonry" cols={3} gap={8}>
                    {images.map((image: ReservedImage, index) => (
                        <ImageListItem 
                            onClick={() => {
                                onSelect(image.url);
                                onClose();
                            }} 
                            key={image.id}
                            style={{cursor: "pointer"}}>
                            <img
                                // srcSet={`${image.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                src={`${image.url}?w=164&h=164&fit=crop&auto=format`}
                                alt={image.name}
                                loading={index < 15 ? "eager" : "lazy"}
                                // loading={"lazy"}
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover' // Это заставит картинку заполнить квадрат, не растягиваясь
                                }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
        </Modal>
    )
}