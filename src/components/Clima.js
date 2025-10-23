import React, { useState } from "react";
import "./Clima.css";

function Clima() {
  const [clima, setClima] = useState(null);
  const [ciudad, setCiudad] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_CLIMA_API_KEY;

  const formatearHora = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const fetchClima = async (nombreCiudad) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${nombreCiudad}&appid=${API_KEY}&units=metric&lang=es`
      );

      if (!response.ok) {
        throw new Error("Ciudad no encontrada");
      }

      const data = await response.json();
      setClima(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ciudad.trim()) {
      fetchClima(ciudad);
    }
  };

  return (
    <div className="clima-container">
      <h1>App progresiva de clima 1190-22-515</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          placeholder="Ingresa una ciudad (Guatemala por ejemplo)"
          className="city-input"
        />
        <button type="submit" className="search-button">
          Buscar
        </button>
      </form>

      {loading && <p className="loading">Cargando...</p>}
      {error && <p className="error">{error}</p>}

      {clima && !loading && (
        <div className="clima-info">
          <h2>
            {clima.name}, {clima.sys.country}
          </h2>
          <div className="temperature">{Math.round(clima.main.temp)} °C</div>
          <p className="description">{clima.weather[0].description}</p>
          <div className="detalles">
            <div className="detalles-item">
              <span>Temp max</span>
              <span className="valor">
                {Math.round(clima.main.temp_max)} °C
              </span>
            </div>
            <div className="detalles-item">
              <span>Temp min</span>
              <span className="valor">
                {Math.round(clima.main.temp_min)} °C
              </span>
            </div>
            <div className="detalles-item">
              <span>Humedad</span>
              <span className="valor">{clima.main.humidity}%</span>
            </div>
            <div className="detalles-item">
              <span>Viento</span>
              <span className="valor">{clima.wind.speed} m/s</span>
            </div>
            <div className="detalles-item">
              <span>Sensación</span>
              <span className="valor">
                {Math.round(clima.main.feels_like)}°C
              </span>
            </div>
            <div className="detalles-item">
              <span>Amanecer</span>
              <span className="valor">{formatearHora(clima.sys.sunrise)}</span>
            </div>
            <div className="detalles-item">
              <span>Atardecer</span>
              <span className="valor">{formatearHora(clima.sys.sunset)}</span>
            </div>
            <div className="detalles-item">
              <span>Presión</span>
              <span className="valor">{clima.main.pressure} hPa</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clima;
