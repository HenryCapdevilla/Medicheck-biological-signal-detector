import cv2
import mediapipe as mp
import numpy as np

class ROIDetector:
    """Identifica diferentes zonas de la cara como regiones de interés (ROI).
    """
    _lower_faceleft = [357, 350, 349, 348, 347, 346, 280, 425, 266, 371, 355, 437, 343]  # Índices de la parte inferior de la cara
    _lower_faceright = [117, 123, 187, 205, 36, 142, 126, 47, 121, 120, 119, 118]  # Índices de la parte inferior de la cara
    _forehead = [107, 9, 336, 337, 151, 108]  # Índices de la frente

    def __init__(self):
        """Inicializa el detector (Mediapipe FaceMesh).
        """
        self.face_mesh = mp.solutions.face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def process(self, frame):
        """Encuentra una sola cara en el fotograma y extrae diferentes zonas de la cara (frente y parte inferior).
        """
        results = self.face_mesh.process(frame)

        point_list_lower_faceleft = []
        point_list_lower_faceright = []
        point_list_forehead = []
        if results.multi_face_landmarks is not None:
            coords = self._get_facemesh_coords(results.multi_face_landmarks[0], frame)
            point_list_lower_faceleft = coords[self._lower_faceleft, :2]  # :2 -> solo x e y
            point_list_lower_faceright = coords[self._lower_faceright, :2]  # :2 -> solo x e y
            point_list_forehead = coords[self._forehead, :2]  # :2 -> solo x e y

        # Crear máscaras para ambas regiones
        roimask_lower_faceleft = self._fill_roimask(point_list_lower_faceleft, frame)
        roimask_lower_faceright = self._fill_roimask(point_list_lower_faceright, frame)
        roimask_forehead = self._fill_roimask(point_list_forehead, frame)

        # Combinar las tres máscaras
        roimask_combined = cv2.bitwise_or(roimask_forehead, roimask_lower_faceleft)
        roimask_combined = cv2.bitwise_or(roimask_combined, roimask_lower_faceright)

        return roimask_combined, results

    def _get_facemesh_coords(self, landmark_list, img):
        """Extrae las coordenadas de los landmarks de FaceMesh en una matriz NumPy de 468x3.
        """
        h, w = img.shape[:2]  # Obtener ancho y alto de la imagen
        xyz = [(lm.x, lm.y, lm.z) for lm in landmark_list.landmark]

        return np.multiply(xyz, [w, h, w]).astype(int)

    def _fill_roimask(self, point_list, img):
        """Crea una máscara binaria, rellenada dentro del contorno dado por la lista de puntos.
        """
        mask = np.zeros(img.shape[:2], dtype="uint8")
        if len(point_list) > 2:
            contours = np.reshape(point_list, (1, -1, 1, 2))  # esperado por OpenCV
            cv2.drawContours(mask, contours, 0, color=255, thickness=cv2.FILLED)
        return mask

    def close(self):
        """Finaliza (cierra la instancia de Face Mesh).
        """
        self.face_mesh.close()

def visualize_roi(video_source=0):
    """Función para capturar video y visualizar la máscara ROI.
    """
    cap = cv2.VideoCapture(video_source)
    roi_detector = ROIDetector()

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("No se puede leer el fotograma del video.")
            break

        # Procesar el fotograma para obtener la máscara ROI
        roimask, results = roi_detector.process(frame)

        # Aplicar la máscara a la imagen original
        frame_roi = cv2.bitwise_and(frame, frame, mask=roimask)

        # Mostrar el fotograma original y la ROI combinada
        cv2.imshow('Frame Original', frame)
        cv2.imshow('Frame ROI', frame_roi)

        # Esperar 1 ms y salir si se presiona 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Liberar la captura y cerrar ventanas
    cap.release()
    roi_detector.close()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    visualize_roi()  # Iniciar la visualización con la cámara predeterminada.
