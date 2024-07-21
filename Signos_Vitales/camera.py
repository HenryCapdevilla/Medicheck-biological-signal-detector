# camera.py
import cv2
from rppg import RPPG
from detector import ROIDetector

def process_video(video_path):
    # Inicializar el detector de regiones de interés (ROI)
    roi_detector = ROIDetector()

    # Inicializar el procesador RPPG con la ruta del archivo de video
    rppg_processor = RPPG(video_path=video_path)

    # Obtener un generador para procesar cada fotograma del video
    video_generator = rppg_processor.process_video()

    g_values = []

    try:
        for result in video_generator:
            # Aplicar el detector de ROI al fotograma actual
            roimask, _ = result.roimask, result.landmarks

            # Aplicar la máscara del ROI al fotograma
            frame_roi = cv2.bitwise_and(result.rawimg, result.rawimg, mask=roimask)

            # Obtener el valor de 'g' del último frame procesado
            g_value = result.signal[-1]
            g_values.append(g_value)

    finally:
        # Detener el procesamiento y liberar recursos
        rppg_processor.stop()
        roi_detector.close()
        cv2.destroyAllWindows()

    return g_values
