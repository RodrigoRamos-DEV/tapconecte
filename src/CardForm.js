import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import logoImage from './assets/images/logo.jpg';
import { FaInstagram, FaFacebook, FaWhatsapp, FaLinkedin, FaYoutube, FaTiktok, FaTwitter, FaPinterest } from 'react-icons/fa'; // Importando ícones

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !whatsapp) {
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
  };

  const handleBgImageChange = (e) => {
    setBgImage(e.target.files[0]);
  };

  const handleCarouselImageChange = (index, e) => {
    const updatedImages = [...carouselImages];
    updatedImages[index] = e.target.files[0];
    setCarouselImages(updatedImages);
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
        <h1 className="text-center mb-4">3D Connect</h1>
        {error && <p className="alert alert-danger">{error}</p>}

        <div>
          <button onClick={() => setActiveTab('profile')}>Informações de Perfil</button>
          <button onClick={() => setActiveTab('social')}>Redes Sociais</button>
          <button onClick={() => setActiveTab('slides')}>Pesonalização</button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === 'profile' && (
            <div>
              <h3>Informações de Perfil</h3>
              <div className="form-group">
                <label className="label-white">Nome:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="label-white">Telefone:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="label-white">Endereço:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="label-white">Sobre:</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div>
              <h3>Redes Sociais</h3>
              <div className="form-group">
                <label className="label-white">Instagram:</label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="label-white">Facebook:</label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="form-control"
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
                />
              </div>
              <div className="form-group">
                <label className="label-white">Chave PIX:</label>
                <input
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="label-white">Website:</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="label-white">LinkedIn:</label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="label-white">YouTube:</label>
                <input
                  type="url"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="label-white">TikTok:</label>
                <input
                  type="url"
                  value={tiktok}
                  onChange={(e) => setTiktok(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="label-white">X:</label>
                <input
                  type="url"
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
          )}

          {activeTab === 'slides' && (
            <div>
              <h3>Slides</h3>
              <div className="form-group">
                <label className="label-white">Logo:</label>
                <input
                  type="file"
                  onChange={handleLogoChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="label-white">Imagem de Fundo:</label>
                <input
                  type="file"
                  onChange={handleBgImageChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="label-white">Carrossel de Imagens:</label>
                {[0, 1, 2].map((index) => (
                  <input
                    key={index}
                    type="file"
                    onChange={(e) => handleCarouselImageChange(index, e)}
                    className="form-control"
                  />
                ))}
              </div>

              {/* Seleção de ícone */}
              <div>
                <h4>Selecione um Ícone para Redes Sociais:</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <FaInstagram onClick={() => handleIconSelect('instagram')} style={{ cursor: 'pointer', fontSize: '24px' }} />
                  <FaFacebook onClick={() => handleIconSelect('facebook')} style={{ cursor: 'pointer', fontSize: '24px' }} />
                  <FaWhatsapp onClick={() => handleIconSelect('whatsapp')} style={{ cursor: 'pointer', fontSize: '24px' }} />
                  <FaLinkedin onClick={() => handleIconSelect('linkedin')} style={{ cursor: 'pointer', fontSize: '24px' }} />
                  <FaYoutube onClick={() => handleIconSelect('youtube')} style={{ cursor: 'pointer', fontSize: '24px' }} />
                  <FaTiktok onClick={() => handleIconSelect('tiktok')} style={{ cursor: 'pointer', fontSize: '24px' }} />
                  <FaTwitter onClick={() => handleIconSelect('twitter')} style={{ cursor: 'pointer', fontSize: '24px' }} />
                  <FaPinterest onClick={() => handleIconSelect('pinterest')} style={{ cursor: 'pointer', fontSize: '24px' }} />
                </div>
                {selectedIcon && <p>Ícone Selecionado: {selectedIcon}</p>}
              </div>

              {/* Seletores de cor */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <div>
                  <button
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
                    type="button"
                    onClick={() => {
                      setShowPicker({ ...showPicker, label: !showPicker.label });
                      setCurrentPicker('label');
                    }}
                  >
                    Cor da Label
                  </button>
                  {showPicker.label && (
                    <div ref={pickerRef}>
                      <ChromePicker color={labelBgColor} onChange={(color) => handleColorChange(color, 'label')} />
                    </div>
                  )}
                </div>

                <div>
                  <button
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

          <button type="submit" className="btn btn-primary">
            Salvar e Visualizar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardForm;
