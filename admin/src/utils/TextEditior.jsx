import { useState } from 'react';
import './font.css'

const RichTextEditor = () => {
    const [content, setContent] = useState('<p>Type your text here...</p>');
    const [fontSize, setFontSize] = useState('16px');
    const [fontFamily, setFontFamily] = useState('Arial'); // Default font
    const [language, setLanguage] = useState('English'); // Default language

    const handleInputChange = (event) => {
        setContent(event.target.value);
    };

    const handleFontSizeChange = (event) => {
        setFontSize(event.target.value);
    };

    const handleFontFamilyChange = (event) => {
        setFontFamily(event.target.value);
    };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
        // Add logic to change the language as needed
    };

    const handleListCommand = (type) => {
        const listType = type === 'ordered' ? 'ol' : 'ul';
        const listStyle = type === 'ordered' ? 'decimal' : 'circle';
        console.log(type, listStyle, listType)
        document.execCommand('insertHTML', false, `<${listType} style="list-style-type: ${listStyle}"><li>Item 1</li></${listType}>`);
    };

    const handleLinkCommand = () => {
        const url = prompt('Enter the link URL:', 'http://');
        document.execCommand('createLink', false, url);
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="mb-4 flex flex-wrap gap-2">
                <button onClick={() => document.execCommand('bold')} className="btn">Bold</button>
                <button onClick={() => document.execCommand('italic')} className="btn">Italic</button>
                <button onClick={() => document.execCommand('underline')} className="btn">Underline</button>
                <button onClick={() => handleListCommand('ordered')} className="btn">OL</button>
                <button onClick={() => handleListCommand('unordered')} className="btn">UL</button>
                <button onClick={handleLinkCommand} className="btn">Link</button>
                <select value={fontSize} onChange={handleFontSizeChange} className="btn bg-white">
                    <option value="8px">8px</option>
                    <option value="10px">10px</option>
                    <option value="12px">12px</option>
                    <option value="16px">16px</option>
                    <option value="18px">18px</option>
                    <option value="24px">24px</option>
                    <option value="32px">32px</option>
                </select>
                <select value={fontFamily} onChange={handleFontFamilyChange} className="btn bg-white">
                    <option value="Arial">Arial</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="LMG - ARUN">LMG - ARUN</option>
                    {/* Add more font options as needed */}
                </select>
                <select value={language} onChange={handleLanguageChange} className="btn bg-white">
                    <option value="English">English</option>
                    <option value="Gujarati">Gujarati</option>
                    {/* Add more language options as needed */}
                </select>
            </div>
            <div
                contentEditable
                className="border p-4 min-h-[200px] focus:outline-none"
                style={{ fontSize: fontSize, fontFamily: fontFamily, whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ __html: content }}
                onInput={handleInputChange}
            ></div>
        </div>
    );
};

export default RichTextEditor;
