import cv2
import mediapipe as mp
import numpy as np

class ROIDetector:
    """Identifica la parte inferior de la cara como la región de interés (ROI).
    """

    _lower_face = [200, 431, 411, 340, 349, 120, 111, 187, 211]  # Índices de la malla

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
        """Encuentra una sola cara en el fotograma y extrae la mitad inferior de la cara.
        """
        results = self.face_mesh.process(frame)

        point_list = []
        if results.multi_face_landmarks is not None:
            coords = self._get_facemesh_coords(results.multi_face_landmarks[0], frame)
            point_list = coords[self._lower_face, :2]  # :2 -> solo x e y
        roimask = self._fill_roimask(point_list, frame)

        return roimask, results

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
