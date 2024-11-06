import React from 'react';

const ClinicalHistoryButton = () => {
  const openNewTab = () => {
    const newWindow = window.open('', '_blank', 'width=600,height=400');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Historia Clínica</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h2 { text-align: center; }
              label { display: block; margin-top: 10px; font-weight: bold; }
              input, textarea { width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; }
              button { margin-top: 15px; padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
              button:hover { background-color: #45a049; }
            </style>
          </head>
          <body>
            <h2>Historia Clínica del Paciente</h2>
            <form id="clinicalHistoryForm">
              <label for="name">Nombre del Paciente:</label>
              <input type="text" id="name" name="name" required />

              <label for="age">Edad:</label>
              <input type="number" id="age" name="age" required />

              <label for="diagnosis">Diagnóstico:</label>
              <input type="text" id="diagnosis" name="diagnosis" required />

              <label for="history">Historia Clínica:</label>
              <textarea id="history" name="history" rows="4" required></textarea>

              <button type="submit">Guardar</button>
            </form>
            <script>
              document.getElementById("clinicalHistoryForm").onsubmit = function(event) {
                event.preventDefault();
                alert("Historia clínica guardada exitosamente.");
                newWindow.close();
              };
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <button onClick={openNewTab} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
      Crear Historia Clínica
    </button>
  );
};

export default ClinicalHistoryButton;
