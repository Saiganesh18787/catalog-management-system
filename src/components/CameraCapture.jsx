import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function CameraCapture({ onCapture, onCancel }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please ensure permissions are granted.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            onCapture(dataUrl);
            stopCamera();
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
            <div className="relative w-full h-full flex flex-col">
                {error ? (
                    <div className="flex-1 flex items-center justify-center text-white p-4 text-center">
                        <p>{error}</p>
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="flex-1 object-cover w-full h-full"
                    />
                )}

                <canvas ref={canvasRef} className="hidden" />

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center">
                    <Button variant="ghost" onClick={onCancel} className="text-white hover:bg-white/20 rounded-full p-4">
                        <X size={32} />
                    </Button>

                    {!error && (
                        <button
                            onClick={capturePhoto}
                            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 active:bg-white/50 transition-colors"
                        >
                            <div className="w-16 h-16 bg-white rounded-full" />
                        </button>
                    )}

                    {!error && (
                        <Button variant="ghost" onClick={() => { stopCamera(); startCamera(); }} className="text-white hover:bg-white/20 rounded-full p-4">
                            <RefreshCw size={24} />
                        </Button>
                    )}
                    {/* Spacer if error to keep X aligned */}
                    {error && <div className="w-12" />}
                </div>
            </div>
        </div>
    );
}
