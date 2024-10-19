// script.js

document.addEventListener('DOMContentLoaded', function() {
    const chatWindow = document.getElementById('chatWindow');
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');

    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = userInput.value.trim();
        if (message) {
            addMessageToChat('user', message);
            userInput.value = '';
            getBotResponse(message);
        }
    });

    function addMessageToChat(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        const messageText = document.createElement('div');
        messageText.classList.add('message-text');
        messageText.textContent = text;

        messageDiv.appendChild(messageText);
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function getBotResponse(userMessage) {
        // Simulação da chamada à API do Gemini
        fetchGeminiResponse(userMessage)
            .then(botMessage => {
                addMessageToChat('bot', botMessage);
            })
            .catch(error => {
                console.error('Erro:', error);
                addMessageToChat('bot', 'Desculpe, ocorreu um erro.');
            });
    }

    async function fetchGeminiResponse(userMessage) {
        // Substitua pela sua chave de API e endpoint reais
        const API_KEY = 'SUA_CHAVE_DE_API';
        const API_ENDPOINT = 'https://api.gemini.com/v1/chat/completions';

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gemini', // Supondo que o modelo seja chamado 'gemini'
                messages: [{ role: 'user', content: userMessage }]
            })
        });

        const data = await response.json();
        if (response.ok) {
            const botMessage = data.choices[0].message.content.trim();
            return botMessage;
        } else {
            throw new Error(data.error.message);
        }
    }
});
