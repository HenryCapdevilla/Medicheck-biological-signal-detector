# mainwindow.py

import cv2
from PyQt5.QtWidgets import QMainWindow, QGraphicsView, QLabel
from PyQt5.QtGui import QFont, QColor
import pyqtgraph as pg
import mediapipe as mp
import numpy as np

from rppg import RPPG

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_face_mesh = mp.solutions.face_mesh

pg.setConfigOption("antialias", True) #Suavizado en la gráfica

class MainWindow(QMainWindow):
    def __init__(self, rppg):
        """MainWindow visualizing the output of the RPPG model.
        """
        super().__init__()

        rppg.rppg_updated.connect(self.on_rppg_updated)
        self.init_ui()
        
        # Establecer el tamaño inicial de la ventana
        self.setGeometry(100, 100, 800, 600)
        
        self.signal_label = QLabel(self)
        self.signal_label.setGeometry(100, 450, 200, 50)
        
        # Cambiar el grosor de la fuente del QLabel
        font = QFont("Bebas Neue", 20, QFont.Bold)  # Fuente Arial, tamaño 12 y en negrita
        self.signal_label.setFont(font)

    def on_rppg_updated(self, output):
        """Update UI based on RppgResults.
        """
        img = output.rawimg.copy()
        draw_facemesh(img, output.landmarks, tesselate=True, contour=False)
        img = draw_roimask(img, output.roimask, color=(221, 43, 42))
        self.img.setImage(img)

        self.line.setData(y=output.signal[-200:]) #Gráfica Datos
        
        # Mostrar el valor de output.signal en la consola
        last_signal_value = int(output.signal[-1])
        # Mostrar el último dato de output.signal en la consola
        print("Last Signal Value:", last_signal_value)
        
        #Se imprime en la interfaz
        self.signal_label.setText("Ritmo Cardiaco: {}".format(last_signal_value))
        
        # Cambiar la imagen según el rango de valores
        if 60 <= last_signal_value <= 100:
            self.signal_label.setStyleSheet("color: green")  # Establece el color rojo
        else:
            self.signal_label.setStyleSheet("color: red")  # Establece el color rojo
            


    def init_ui(self):
        """Initialize window with pyqtgraph image view box in the center.
        """
        self.setWindowTitle("Heartbeat signal extraction")
        layout = pg.GraphicsLayoutWidget()
        
        #Para modificar la ventana de la cámaras
        self.img = pg.ImageItem(axisOrder="row-major") #Muestra la imagen de la cámara en la interfaz
        vb = layout.addViewBox(invertX=True, invertY=True, lockAspect=True) #invertX=True y invertY=True permite corregir la visión de la cámara para que el moviento del sujeto sea como su espejo
        vb.setMinimumSize(320, 320)  # Dimensiones de la cámara en la interfaz
        vb.addItem(self.img) #Permite mostrar la imagen de la cámara en la interfaz

        self.plot = layout.addPlot(row=1, col=1) #Gráfica
        self.line = self.plot.plot(pen=pg.mkPen("#078C7E", width=3))#Gráfica
        
        self.setCentralWidget(layout)

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
