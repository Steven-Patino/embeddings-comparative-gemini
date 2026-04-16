const form = document.querySelector('#embedding-form');
const textInput = document.querySelector('#text-input');
const submitButton = document.querySelector('#submit-button');
const resultCard = document.querySelector('#result-card');
const requestIdElement = document.querySelector('#request-id');
const similarityElement = document.querySelector('#similarity');
const statusMessage = document.querySelector('#status-message');

function setStatus(message, className = '') {
  statusMessage.textContent = message;
  statusMessage.className = 'status-message';

  if (className) {
    statusMessage.classList.add(className);
  }
}

function formatSimilarity(value) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return 'No disponible';
  }

  return numericValue.toFixed(6);
}

function showResult({ requestId, similarity }) {
  requestIdElement.textContent = requestId;
  similarityElement.textContent = formatSimilarity(similarity);
  resultCard.classList.remove('hidden');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = textInput.value.trim();

  if (!text) {
    setStatus('Escribe una palabra o frase antes de continuar.', 'is-error');
    resultCard.classList.add('hidden');
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Consultando...';
  setStatus('Generando embeddings y calculando similitud...', 'is-loading');

  try {
    const response = await fetch('/api/embeddings/compare', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || 'No fue posible procesar la solicitud.');
    }

    showResult(payload.data);
    setStatus('Resultado generado correctamente.');
  } catch (error) {
    resultCard.classList.add('hidden');
    setStatus(error.message || 'Ocurrio un error inesperado.', 'is-error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Obtener resultado';
  }
});
