import cv2
import numpy as np
from detector import ROIDetector, fill_roimask
from mainwindow import MainWindow
from rppg import RPPG, RppgResults

face_detector = cv2.CascadeClassifier(cv2.data.haarcascades +
                                      "haarcascade_frontalface_default.xml")
roi_detector = ROIDetector()  # Crea una instancia del detector de ROI

# Crea una instancia de la clase RPPG
rppg_instance = RPPG()

mainwindow_instance = MainWindow()

def generate():
    global data
    while True:
        ret, frame = cap.read()

        if ret:
            frame = cv2.flip(frame, 1)  # Invertir horizontalmente (1)
            
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_detector.detectMultiScale(gray, 1.3, 5)
            for(x,y,w,h) in faces:
                cv2.rectangle(frame, (x,y), (x + w, y + h), (0, 255, 0), 2)
            
            # Procesar la ROI del rostro
            roimask, results = roi_detector.process(frame)
            frame_with_roi = cv2.addWeighted(frame, 1, cv2.cvtColor(roimask, cv2.COLOR_GRAY2BGR), 0.5, 0)
            rppg_instance.on_frame_received(frame)
            (frame_with_roi_encoded, encodedImage) = cv2.imencode(".jpg", frame_with_roi) #Transmición más estable
            
            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')
            
            
        if not ret:
            break


def append_last_signal():
    data = []
    data.append(rppg_instance.print_signal())
    return data[-1]


if __name__ == '__main__':
    app.run(debug=True)