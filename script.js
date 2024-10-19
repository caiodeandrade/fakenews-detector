// script.js

document.addEventListener('DOMContentLoaded', function() {
    const chatWindow = document.getElementById('chatWindow');
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');

    // Determina o tópico com base no título da página
    const pageTitle = document.title;
    let systemPrompt = 'Você é um assistente especializado em verificar informações e esclarecer dúvidas sobre fake news.';
    let assistantInitialMessage = '';

    // Personaliza o comportamento do assistente com base no tópico
    if (pageTitle.includes('Queimadas na Amazônia')) {
        systemPrompt = 'Você é um assistente especializado em verificar informações e esclarecer dúvidas sobre as queimadas na Amazônia. Forneça respostas precisas e baseadas em fatos.';
        assistantInitialMessage = 'As queimadas na Amazônia têm sido um assunto de grande preocupação global devido ao seu impacto ambiental e climático. Como posso ajudá-lo?';
    } else if (pageTitle.includes('Gusttavo Lima Preso')) {
        systemPrompt = 'Você é um assistente especializado em verificar informações e esclarecer dúvidas sobre notícias envolvendo o cantor Gusttavo Lima, especialmente rumores sobre sua suposta prisão. Forneça respostas precisas, baseadas em fatos e fontes confiáveis.';
        assistantInitialMessage = 'Circulou nas redes sociais a informação de que o cantor Gusttavo Lima teria sido preso. Até o momento, não há registros oficiais ou fontes confiáveis que confirmem essa notícia. Como posso ajudá-lo?';
    } else if (pageTitle.includes('Cadeirada de Datena no Pablo Marçal')) {
        systemPrompt = 'Você é um assistente especializado em verificar informações e esclarecer dúvidas sobre notícias envolvendo o apresentador Datena e o coach Pablo Marçal, especialmente rumores sobre um suposto incidente de agressão. Forneça respostas precisas, baseadas em fatos e fontes confiáveis.';
        assistantInitialMessage = 'Há rumores de que o apresentador Datena teria agredido Pablo Marçal com uma cadeira durante uma entrevista. Até o momento, não existem evidências ou fontes confiáveis que confirmem esse incidente. Como posso ajudá-lo?';
    } else if (pageTitle.includes('Grávida de Taubaté')) {
        systemPrompt = 'Você é um assistente especializado em verificar informações e esclarecer dúvidas sobre o caso da "Grávida de Taubaté" e a importância da verificação de informações na mídia. Forneça respostas precisas, baseadas em fatos e fontes confiáveis.';
        assistantInitialMessage = 'O caso da "Grávida de Taubaté" ocorreu em 2012, quando uma mulher afirmou estar grávida de quadrigêmeos. Posteriormente, foi revelado que a gravidez era uma farsa. Como posso ajudá-lo?';
    } else {
        // Caso seja a página chat.html
        systemPrompt = 'Você é um assistente especializado em verificar informações e esclarecer dúvidas sobre notícias e fatos. Forneça respostas precisas, baseadas em fatos e fontes confiáveis.';
        assistantInitialMessage = 'Olá! Eu sou o FakeNews Detector AI. Estou aqui para ajudá-lo a verificar notícias e informações. Como posso ajudá-lo hoje?';
    }

    // Adiciona a mensagem inicial do assistente ao chat, se disponível
    if (assistantInitialMessage) {
        addMessageToChat('bot', assistantInitialMessage);
    }

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
        fetchOpenAIResponse(userMessage)
            .then(botMessage => {
                addMessageToChat('bot', botMessage);
            })
            .catch(error => {
                console.error('Erro:', error);
                addMessageToChat('bot', 'Desculpe, ocorreu um erro.');
            });
    }

    async function fetchOpenAIResponse(userMessage) {
        // Substitua 'SUA_CHAVE_DE_API' pela sua chave de API da OpenAI
        const API_KEY = 'SUA_CHAVE_DE_API';
        const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

        // Construir o histórico de mensagens
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'assistant', content: assistantInitialMessage },
            { role: 'user', content: userMessage }
        ];

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            if (response.ok) {
                const botMessage = data.choices[0].message.content.trim();
                return botMessage;
            } else {
                console.error('Erro da API:', data);
                throw new Error(data.error.message);
            }
        } catch (error) {
            console.error('Erro na comunicação com a API:', error);
            throw error;
        }
    }
});
