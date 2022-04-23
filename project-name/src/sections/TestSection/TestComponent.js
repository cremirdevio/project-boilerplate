import testHtml from 'Sections/TestSection/TestComponent.html';
import './TestComponent.scss';

const TextComponent = () => {
    document.body.innerHTML += testHtml;
};

export default TextComponent;
