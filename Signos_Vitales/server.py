from flask import Flask, request, jsonify
import os

from rppg import RPPG
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'records'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
CORS(app)  # Habilita CORS para todas las rutas del servidor Flask

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'video' not in request.files:
        return jsonify({'error': 'No video part in the request'}), 400
    
    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    file.save(input_path)
    print(f'Received file: {filename}')
    print(f'Input path: {input_path}')

    # Llamar al script de procesamiento de video y obtener los valores de 'g'
    try:
        rppg_generator = RPPG(input_path).process_video()  # Crea el generador
        results = next(rppg_generator)  # Obtén el primer (y único) resultado del generador
        heart_rate = results.heart_rate  # Accede a la frecuencia cardíaca
        spo2_rate = results.spo2_rate
        print(f"V3Heart Rate: {heart_rate:.2f} BPM")  # Imprime el corazón en el servidor
        print(f"V3Sp02: {spo2_rate:.2f} %")  # Imprime el corazón en el servidor
        response_data = {'message': 'Video uploaded successfully', 'heart_rate': heart_rate, 'spo2_rate' : spo2_rate}
        return jsonify(response_data), 200
    
    except Exception as e:
        print('Error processing video:', e)
        return jsonify({'error': 'Video processing failed'}), 500


if __name__ == '__main__':
    app.run(port=5000)
