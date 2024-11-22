import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <>
        <Typewriter
          options={{
            strings: [
              "El futuro de la medicina es ahora: conecta, mide y cuida sin barreras.",
              "Accede a atención médica precisa y confiable, sin salir de casa.",
              "Tu salud, al alcance de un clic.",
            ],
            autoStart: true,
            loop: true,
            deleteSpeed: 50,
          }}
        />
    </>
  );
}

export default Type;