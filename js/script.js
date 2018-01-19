const parentFrame = document.getElementById('parent-frame');
const addButton = document.getElementById('add-frame');

let frames = [];

document.addEventListener('DOMContentLoaded', () => {
    parentFrame.contentWindow.addEventListener('message', (data) => {
        updateChat(data.data);
    });

    addButton.addEventListener('click', () => {
        const frameBody = parentFrame.contentWindow.document.body;

        frameBody.appendChild(createFrame());
        addEventListenerToButton();
    });
});

function createFrame() {
    const frame = createElement('iframe');

    addStylesToFrame(frame);
    frames.push(frame);
    parentFrame.contentWindow.postMessage(makeSystemMsg(frames.length), '*');

    return frame;
}

function updateChat(message) {
    setTimeout(() => {
        frames.forEach((frame) => {
            const post = createElement('p');
            const chat = frame.contentDocument.getElementById('chat');

            frame.contentDocument.body.appendChild(makeStylesLink());
            post.innerText = message;
            chat.prepend(post);
        });
    }, 100);
}

function addEventListenerToButton() {
    setTimeout(() => {
        frames.forEach((frame, index) => {
            const btn = frame.contentDocument.getElementById('sendMessage');
            const input = frame.contentDocument.getElementById('messageInput');

            let id = ++index;

            btn.addEventListener('click', () => {
                if (!input.value) {
                    return;
                }

                sendMassage(id, input.value);
                input.value = '';
            });
        });
    }, 100);
}

function addStylesToFrame(frame) {
    frame.setAttribute('src', 'template/frame.html');
    frame.setAttribute('frameborder', '0');
    frame.setAttribute('marginwidth', '20px');
    frame.setAttribute('marginheight', '20px');
    frame.setAttribute('height', '350px');
    frame.setAttribute('width', '400px');
}

function makeStylesLink() {
    const cssLink = document.createElement("link");

    cssLink.href = "../css/iframe.css";
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";

    return cssLink;
}

function sendMassage(id, massage) {
    parentFrame.contentWindow.postMessage(makeFrameMsg(id, massage), '*');
}

function createElement(tagName) {
    return document.createElement(tagName);
}

function makeSystemMsg(id) {
    return `[system] - ifraim-${id} joined the conversation`;
}

function makeFrameMsg(id, message) {
    return `[frame-${id}] - ${message}`;
}