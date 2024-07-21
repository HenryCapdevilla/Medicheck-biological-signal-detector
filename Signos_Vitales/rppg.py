# rppg.py

from collections import namedtuple
import mediapipe as mp
import cv2

from detector import ROIDetector

RppgResults = namedtuple("RppgResults", ["rawimg",
                                         "roimask",
                                         "landmarks",
                                         "signal",
                                         ])

class RPPG:
    def __init__(self, video_path):
        self.video_path = video_path
        self.detector = ROIDetector()
        self.signal = []

    def process_video(self):
        """Procesar cada fotograma del video: encontrar malla facial y extraer señal de pulso."""
        cap = cv2.VideoCapture(self.video_path)
        while cap.isOpened():
            ret, frame = cap.read()

            if ret:
                rawimg = frame.copy()
                roimask, results = self.detector.process(frame)

                r, g, b, a = cv2.mean(rawimg, mask=roimask)
                self.signal.append(g)

                yield RppgResults(rawimg=rawimg,
                                  roimask=roimask,
                                  landmarks=results,
                                  signal=self.signal)
            else:
                print("No more frames to process.")
                break

        cap.release()
        cv2.destroyAllWindows()
        print("Video processing finished.")

    def stop(self):
        """Detener el procesamiento y liberar recursos"""
        self.detector.close()

