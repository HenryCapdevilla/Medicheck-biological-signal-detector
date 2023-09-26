# mainwindow.py

import cv2
import mediapipe as mp
import numpy as np

from streamapp.rppg import RPPG

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_face_mesh = mp.solutions.face_mesh

class MainWindow:

    def on_rppg_updated(self, output):
        """Update UI based on RppgResults.
        """
        img = output.rawimg.copy()
        draw_facemesh(img, output.landmarks, tesselate=True, contour=False)
        img = draw_roimask(img, output.roimask, color=(221, 43, 42))
        self.img.setImage(img)

        #self.line.setData(y=output.signal[-200:]) #Gráfica Datos
        
        # Mostrar el valor de output.signal en la consola
        last_signal_value = int(output.signal[-1])

#Mascara que analiza el ritmo cardiaco
def draw_roimask(img, roimask, weight=0.5, color=(255, 0, 0)):
    """Highlight region  of interest with specified color.
    """
    overlay = img.copy()
    overlay[roimask != 0, :] = color
    outimg = cv2.addWeighted(img, 1-weight, overlay, weight, 0)
    return outimg

#Mascara que abarca todo el rostro de la cara
def draw_facemesh(img, results, tesselate=False,
                  contour=False, irises=False):
    """Draw all facemesh landmarks found in an image.

    Irises are only drawn if the corresponding landmarks are present,
    which requires FaceMesh to be initialized with refine=True.
    """
    if results is None or results.multi_face_landmarks is None:
        return

    for face_landmarks in results.multi_face_landmarks:
        if tesselate:
            mp.solutions.drawing_utils.draw_landmarks(
                image=img,
                landmark_list=face_landmarks,
                connections=mp_face_mesh.FACEMESH_TESSELATION,
                landmark_drawing_spec=None,
                connection_drawing_spec=mp_drawing_styles
                .get_default_face_mesh_tesselation_style())
        if contour:
            mp.solutions.drawing_utils.draw_landmarks(
                image=img,
                landmark_list=face_landmarks,
                connections=mp.solutions.face_mesh.FACEMESH_CONTOURS,
                landmark_drawing_spec=None,
                connection_drawing_spec=mp.solutions.drawing_styles
                .get_default_face_mesh_contours_style())
        if irises and len(face_landmarks) > 468:
            mp.solutions.drawing_utils.draw_landmarks(
                image=img,
                landmark_list=face_landmarks,
                connections=mp_face_mesh.FACEMESH_IRISES,
                landmark_drawing_spec=None,
                connection_drawing_spec=mp_drawing_styles
                .get_default_face_mesh_iris_connections_style())
