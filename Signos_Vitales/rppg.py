import os
from collections import namedtuple
import mediapipe as mp
import cv2
import numpy as np
from scipy.signal import butter, filtfilt, find_peaks
from detector import ROIDetector

RppgResults = namedtuple("RppgResults", ["rawimg", "roimask", "landmarks", "signal", "heart_rate", "spo2_rate"])

class RPPG:
    def __init__(self, video_path, output_dir='output_masks'):
        self.video_path = video_path
        self.detector = ROIDetector()
        self.signal = []  # Para almacenar las señales de intensidad
        self.red_intensity = []  # For red channel intensity (for SpO₂ calculation)
        self.output_dir = output_dir  # Directorio donde se guardarán las máscaras
        os.makedirs(self.output_dir, exist_ok=True)  # Crear el directorio si no existe

    def butter_bandpass_filter(self, data, order=4, lowcut=0.7, highcut=2.0, fs=30):
        """Aplica un filtro pasa banda a los datos"""
        nyquist = 0.5 * fs
        low = lowcut / nyquist
        high = highcut / nyquist
        b, a = butter(order, [low, high], btype='band')
        filtered_data = filtfilt(b, a, data)
        return filtered_data

    def calculate_hr_and_spo2(self, fps):
        # Heart rate calculation
        if len(self.signal) > 30:
            filtered_intensity_values = self.butter_bandpass_filter(self.signal, lowcut=0.7, highcut=2.0, fs=fps)
        else:
            filtered_intensity_values = self.signal

        peaks, _ = find_peaks(filtered_intensity_values, distance=fps/2)
        peak_times = np.array(peaks) / fps
        
        if len(peak_times) < 2:
            return 0, 0, filtered_intensity_values, peaks

        intervals = np.diff(peak_times)
        avg_interval = np.mean(intervals)
        hr = 60 / avg_interval if avg_interval else 0

        # SpO₂ calculation
        filtered_red = self.butter_bandpass_filter(self.red_intensity, lowcut=0.7, highcut=1.5, fs=fps)
        filtered_green = filtered_intensity_values

        ac_red = np.std(filtered_red)
        dc_red = np.mean(self.red_intensity)
        ac_green = np.std(filtered_green)
        dc_green = np.mean(self.signal)

        r = (ac_red / dc_red) / (ac_green / dc_green) if dc_red != 0 and dc_green != 0 else 0
        spo2 = 110 - 13.5 * r if r != 0 else 0

        return hr, spo2, filtered_intensity_values, peaks, filtered_red, filtered_green

    def extract_intensities(self):
        """Extrae la intensidad del canal verde de cada fotograma del video"""
        cap = cv2.VideoCapture(self.video_path)
        frame_count = 0  # Para contar los fotogramas
        
        while cap.isOpened():
            ret, frame = cap.read()
            if ret:
                rawimg = frame.copy()
                roimask, results = self.detector.process(frame)

                if roimask is None or results is None:
                    print("No ROI or landmarks found in frame.")
                    continue  # O maneja el error de otra manera

                if frame_count == 0:
                    # Guarda el primer fotograma y su ROI para usarlo en los resultados
                    self.rawimg = rawimg
                    self.roimask = roimask
                    self.landmarks = results

                # Guarda la máscara ROI como archivo .png
                mask_filename = os.path.join(self.output_dir, f"mask_{frame_count}.png")
                cv2.imwrite(mask_filename, roimask)
                
                # Obtén el valor promedio del canal verde utilizando la máscara ROI
                r, g, b, a = cv2.mean(rawimg, mask=roimask)
                self.signal.append(g)  # Añade el valor del canal verde a la señal
                self.red_intensity.append(r)  # Red channel
                
                frame_count += 1  # Incrementar el contador de fotogramas
            else:
                print("No more frames to process.")
                break

        cap.release()
        cv2.destroyAllWindows()
        print("Finished extracting green channel intensities.")


    def process_signal(self, fps=30):
        if not self.signal:
            print("No signal data to process.")
            return

        hr, spo2, filtered_signal, peaks, filtered_red, filtered_green = self.calculate_hr_and_spo2(fps)
        print(f"Heart Rate: {hr:.2f} BPM, SpO₂: {spo2:.2f}%")
        
        return hr, spo2, filtered_signal, peaks

    def process_video(self):
        """Procesa el video en dos fases: primero extraer la señal, luego calcular la frecuencia cardíaca."""
        # Fase 1: Extraer la intensidad del canal verde de todos los frames
        print("Extracting green channel intensities...")
        self.extract_intensities()
        
        # Fase 2: Procesar la señal extraída para calcular la frecuencia cardíaca
        print("Processing signal to calculate heart rate...")
        hr, spo2, filtered_signal, peaks = self.process_signal()
        # Devuelve los resultados
        yield RppgResults(rawimg=self.rawimg,
                           roimask=self.roimask,
                           landmarks=self.landmarks,
                           signal=self.signal,
                           heart_rate=hr,
                           spo2_rate=spo2)
        return
    
    def stop(self):
        """Detener el procesamiento y liberar recursos"""
        self.detector.close()
