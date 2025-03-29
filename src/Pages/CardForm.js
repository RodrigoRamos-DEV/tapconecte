import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import logoImage from '../assets/images/logo.jpg';
import './cardform.css';

const backgroundStyle = {
  backgroundImage: `url(${logoImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const CardForm = ({ onSubmit }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [logo, setLogo] = useState(null);
  const [pixKey, setPixKey] = useState('');
  const [website, setWebsite] = useState('');
  const [about, setAbout] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [youtube, setYoutube] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [x, setX] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [labelBgColor, setLabelBgColor] = useState('#f0f0f0');
  const [fontColor, setFontColor] = useState('#000000');
  const [bgImage, setBgImage] = useState(null);
  const [carouselImages, setCarouselImages] = useState([null, null, null]);
  const [error, setError] = useState('');
  const [showPicker, setShowPicker] = useState({ bg: false, label: false, font: false });
  const [currentPicker, setCurrentPicker] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null); // Estado para armazenar o ícone selecionado
  const pickerRef = useRef(null);
  const navigate = useNavigate();
  const [logoUploaded, setLogoUploaded] = useState(false);
const [bgImageUploaded, setBgImageUploaded] = useState(false);
const [carouselUploaded, setCarouselUploaded] = useState([false, false, false]);
const [markerPosition, setMarkerPosition] = useState([51.505, -0.09]); // Posição inicial do marcador

  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name ) {
      setError('Nome e WhatsApp são obrigatórios.');
      return;
    }

    const cardData = {
      name,
      instagram,
      facebook,
      whatsapp,
      phone,
      address,
      logo,
      pixKey,
      website,
      about,
      linkedin,
      youtube,
      tiktok,
      x,
      bgColor,
      labelBgColor,
      fontColor,
      bgImage,
      carouselImages,
      selectedIcon, // Adicionando ícone selecionado ao objeto de dados
    };

    onSubmit(cardData);
    navigate('/preview');
  };

 
  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
    setLogoUploaded(true); // Atualiza o estado para indicar que o upload foi feito
  };

  const handleBgImageChange = (e) => {
    setBgImage(e.target.files[0]);
    setBgImageUploaded(true);
  };

  const handleCarouselImageChange = (index, e) => {
    const updatedImages = [...carouselImages];
    updatedImages[index] = e.target.files[0];
    setCarouselImages(updatedImages);
  
    const updatedStatus = [...carouselUploaded];
    updatedStatus[index] = true;
    setCarouselUploaded(updatedStatus);
  };

  const handleColorChange = (color, type) => {
    const rgbaColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
    if (type === 'bg') setBgColor(rgbaColor);
    if (type === 'label') setLabelBgColor(rgbaColor);
    if (type === 'font') setFontColor(rgbaColor);
  };

  const handleIconSelect = (icon) => {
    setSelectedIcon(icon); // Atualiza o ícone selecionado
  };

  return (
    <div style={backgroundStyle}>
      <div className="container my-4" style={{ padding: '20px', width: '90%', maxWidth: '1200px' }}>
        <h1 className="text-center mb-4">Tap Conecte</h1>
        {error && <p className="alert alert-danger">{error}</p>}

        <div class="button-container">
          <button className="glow-on-hover" onClick={() => setActiveTab('profile')}>Informações de Perfil</button>
          <button className="glow-on-hover" onClick={() => setActiveTab('social')}>Redes Sociais</button>
          <button className="glow-on-hover" onClick={() => setActiveTab('slides')}>Pesonalização</button>
        </div>

        <form className="form-container" onSubmit={handleSubmit}>
          {activeTab === 'profile' && (
            <div>
              
              <div className="form-group">
  <label className="label-white">Nome:</label>
  <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
    className="form-control"
    placeholder="João Silva"
  />
</div>
<div className="form-group">
  <label className="label-white">Telefone:</label>
  <input
    type="tel"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="form-control"
    placeholder="(99) 99999-9999"
  />
</div>
<div className="form-group">
<label className="label-white">Endereço:</label>
<label className="label-white">Endereço:</label>
  <input
    type="text"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    className="form-control"
    placeholder="Rua A, 123"
  />
          </div>
<div className="form-group">
  <label className="label-white">Sobre:</label>
  <textarea
    value={about}
    onChange={(e) => setAbout(e.target.value)}
    className="form-control"
    placeholder="Fale um pouco sobre você"
  />
</div>

            </div>
          )}

{activeTab === 'social' && (
  <div className="social-container">
    <div className="social-column">
      <div className="form-group">
        <label className="label-white">Instagram:</label>
        <input
          type="url"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="form-control"
          placeholder="Exemplo: https://instagram.com/seuusuario"
        />
      </div>
      <div className="form-group">
        <label className="label-white">Facebook:</label>
        <input
          type="url"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
          className="form-control"
          placeholder="Exemplo: https://facebook.com/seuusuario"
        />
      </div>
      <div className="form-group">
        <label className="label-white">WhatsApp:</label>
        <input
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          required
          className="form-control"
          placeholder="Exemplo: +55 11 98765-4321"
        />
      </div>
      <div className="form-group">
        <label className="label-white">Chave PIX:</label>
        <input
          type="text"
          value={pixKey}
          onChange={(e) => setPixKey(e.target.value)}
          className="form-control"
          placeholder="Exemplo: chave@pix.com.br"
        />
      </div>
    </div>

    <div className="social-column">
      <div className="form-group">
        <label className="label-white">Website:</label>
        <input
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="form-control"
          placeholder="Exemplo: https://www.seusite.com.br"
        />
      </div>
      <div className="form-group">
        <label className="label-white">LinkedIn:</label>
        <input
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          className="form-control"
          placeholder="Exemplo: https://linkedin.com/in/seunome"
        />
      </div>
      <div className="form-group">
        <label className="label-white">YouTube:</label>
        <input
          type="url"
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
          className="form-control"
          placeholder="Exemplo: https://youtube.com/c/seucanal"
        />
      </div>
      <div className="form-group">
        <label className="label-white">TikTok:</label>
        <input
          type="url"
          value={tiktok}
          onChange={(e) => setTiktok(e.target.value)}
          className="form-control"
          placeholder="Exemplo: https://tiktok.com/@seunome"
        />
      </div>
      <div className="form-group">
        <label className="label-white">X (antigo Twitter):</label>
        <input
          type="url"
          value={x}
          onChange={(e) => setX(e.target.value)}
          className="form-control"
          placeholder="Exemplo: https://x.com/seuusuario"
        />
      </div>
    </div>
  </div>
)}


{activeTab === 'slides' && (
<div>
              
<div className="form-group">
  <label className="label-white"></label>
  <label
    htmlFor="logo-upload"
    className={`custom-file-upload ${logoUploaded ? "uploaded" : "not-uploaded"}`}>
    {logoUploaded ? "✅ Logo Carregada!" : "Escolher Logo"}
  </label>
  <input type="file" id="logo-upload" onChange={handleLogoChange} className="custom-file-input" />
</div>

<div className="form-group">
  <label className="label-white"></label>
  <label
    htmlFor="bg-image-upload"
    className={`custom-file-upload ${bgImageUploaded ? "uploaded" : "not-uploaded"}`}
  >
    {bgImageUploaded ? "✅ Imagem Carregada!" : "Escolher Imagem de Fundo"}
  </label>
  <input type="file" id="bg-image-upload" onChange={handleBgImageChange} className="custom-file-input" />
</div>

<div className="form-group">
  <label className="label-white">Slides:</label>
  {[0, 1, 2].map((index) => (
    <div key={index}>
      <label
        htmlFor={`carousel-upload-${index}`}
        className={`custom-file-upload ${carouselUploaded[index] ? "uploaded" : "not-uploaded"}`}
      >
        {carouselUploaded[index] ? `✅ Slide ${index + 1} Carregado!` : `Escolher Slide ${index + 1}`}
      </label>
      <input
        type="file"
        id={`carousel-upload-${index}`}
        onChange={(e) => handleCarouselImageChange(index, e)}
        className="custom-file-input"
      />
    </div>
  ))}
</div>




             

              {/* Seletores de cor */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <div>
                  <button
                  className="glow-on-hover"
                    type="button"
                    onClick={() => {
                      setShowPicker({ ...showPicker, bg: !showPicker.bg });
                      setCurrentPicker('bg');
                    }}
                  >
                    Cor de Fundo
                  </button>
                  {showPicker.bg && (
                    <div ref={pickerRef}>
                      <ChromePicker color={bgColor} onChange={(color) => handleColorChange(color, 'bg')} />
                    </div>
                  )}
                </div>

                <div>
                  <button
                  className="glow-on-hover"
                    type="button"
                    onClick={() => {
                      setShowPicker({ ...showPicker, label: !showPicker.label });
                      setCurrentPicker('label');
                    }}
                  >
                    Cor da caixa de texto
                  </button>
                  {showPicker.label && (
                    <div ref={pickerRef}>
                      <ChromePicker color={labelBgColor} onChange={(color) => handleColorChange(color, 'label')} />
                    </div>
                  )}
                </div>

                <div>
                  <button
                  className="glow-on-hover"
                    type="button"
                    onClick={() => {
                      setShowPicker({ ...showPicker, font: !showPicker.font });
                      setCurrentPicker('font');
                    }}
                  >
                    Cor da Fonte
                  </button>
                  {showPicker.font && (
                    <div ref={pickerRef}>
                      <ChromePicker color={fontColor} onChange={(color) => handleColorChange(color, 'font')} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary glow-on-hover">Salvar</button>
        </form>
      </div>
    </div>
  );
};

export default CardForm;
