import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import logoImage from '../assets/images/logo.jpg';
import './cardform.css';
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

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

const CardForm = ({ user, onSubmit }) => {
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
  const [selectedIcon] = useState(null); // Estado para armazenar o ícone selecionado
  const pickerRef = useRef(null);
  const navigate = useNavigate();
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [bgImageUploaded, setBgImageUploaded] = useState(false);
  const [carouselUploaded, setCarouselUploaded] = useState([false, false, false]);
  
  // Função para carregar os dados do usuário
  useEffect(() => {
    if (user) {
      // Se o usuário estiver logado, preenche os campos com os dados dele
      setName(user.name || '');
      setInstagram(user.instagram || '');
      setFacebook(user.facebook || '');
      setWhatsapp(user.whatsapp || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setLogo(user.logo || null);
      setPixKey(user.pixKey || '');
      setWebsite(user.website || '');
      setAbout(user.about || '');
      setLinkedin(user.linkedin || '');
      setYoutube(user.youtube || '');
      setTiktok(user.tiktok || '');
      setX(user.x || '');
      setBgColor(user.bgColor || '#ffffff');
      setLabelBgColor(user.labelBgColor || '#f0f0f0');
      setFontColor(user.fontColor || '#000000');
      setBgImage(user.bgImage || null);
      setCarouselImages(user.carouselImages || [null, null, null]);
    }
  }, [user]);

  // Função para enviar os dados do formulário
  const handleSubmit = async (e) => {
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
      selectedIcon,
    };

    try {
      const docRef = await addDoc(collection(db, "users"), cardData); // Armazenando na coleção "users"
      console.log("Documento gravado com ID: ", docRef.id);
    } catch (error) {
      setError("Erro ao salvar os dados no banco de dados.");
    }

    onSubmit(cardData);
    navigate('/preview');
  };

  // Função para atualizar a logo
  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
    setLogoUploaded(true); // Atualiza o estado para indicar que o upload foi feito
  };

  // Função para atualizar a imagem de fundo
  const handleBgImageChange = (e) => {
    setBgImage(e.target.files[0]);
    setBgImageUploaded(true);
  };

  // Função para atualizar as imagens do carrossel
  const handleCarouselImageChange = (index, e) => {
    const updatedImages = [...carouselImages];
    updatedImages[index] = e.target.files[0];
    setCarouselImages(updatedImages);

    const updatedStatus = [...carouselUploaded];
    updatedStatus[index] = true;
    setCarouselUploaded(updatedStatus);
  };

  // Função para lidar com a mudança de cor
  const handleColorChange = (color, type) => {
    const rgbaColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
    if (type === 'bg') setBgColor(rgbaColor);
    if (type === 'label') setLabelBgColor(rgbaColor);
    if (type === 'font') setFontColor(rgbaColor);
  };

  // Função para exibir o seletor de cores
  const handleColorPickerToggle = (type) => {
    setShowPicker({ ...showPicker, [type]: !showPicker[type] });
    setCurrentPicker(type);
  };

  return (
    <div style={backgroundStyle}>
      <div className="container my-4" style={{ padding: '20px', width: '90%', maxWidth: '1200px' }}>
        <h1 className="text-center mb-4">Tap Conecte</h1>
        {error && <p className="alert alert-danger">{error}</p>}

        <div className="button-container">
          <button className="glow-on-hover" onClick={() => setActiveTab('profile')}>Informações de Perfil</button>
          <button className="glow-on-hover" onClick={() => setActiveTab('social')}>Redes Sociais</button>
          <button className="glow-on-hover" onClick={() => setActiveTab('slides')}>Personalização</button>
        </div>

        <form className="form-container" onSubmit={handleSubmit}>
          {/* Formulário do perfil */}
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
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control"
                  placeholder="(XX) XXXX-XXXX"
                />
              </div>
              <div className="form-group">
                <label className="label-white">Endereço:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control"
                  placeholder="Rua X, 123"
                />
              </div>
            </div>
          )}

          {/* Formulário de redes sociais */}
          {activeTab === 'social' && (
            <div className="social-container">
              <div className="form-group">
                <label className="label-white">Instagram:</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="form-control"
                  placeholder="https://instagram.com/seunome"
                />
              </div>
              <div className="form-group">
                <label className="label-white">Facebook:</label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="form-control"
                  placeholder="https://facebook.com/seunome"
                />
              </div>
              <div className="form-group">
                <label className="label-white">LinkedIn:</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="form-control"
                  placeholder="https://linkedin.com/in/seunome"
                />
              </div>
              <div className="form-group">
                <label className="label-white">WhatsApp:</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                  className="form-control"
                  placeholder="(XX) XXXXX-XXXX"
                />
              </div>
            </div>
          )}

          {/* Personalização */}
          {activeTab === 'slides' && (
            <div>
              <div className="form-group">
                <label className="label-white">Cor de Fundo:</label>
                <button type="button" onClick={() => handleColorPickerToggle('bg')} className="btn btn-primary">
                  Escolher cor de fundo
                </button>
                {showPicker.bg && (
                  <ChromePicker color={bgColor} onChange={(color) => handleColorChange(color, 'bg')} />
                )}
              </div>
              <div className="form-group">
                <label className="label-white">Cor do Rótulo:</label>
                <button type="button" onClick={() => handleColorPickerToggle('label')} className="btn btn-primary">
                  Escolher cor do rótulo
                </button>
                {showPicker.label && (
                  <ChromePicker color={labelBgColor} onChange={(color) => handleColorChange(color, 'label')} />
                )}
              </div>
              <div className="form-group">
                <label className="label-white">Cor da Fonte:</label>
                <button type="button" onClick={() => handleColorPickerToggle('font')} className="btn btn-primary">
                  Escolher cor da fonte
                </button>
                {showPicker.font && (
                  <ChromePicker color={fontColor} onChange={(color) => handleColorChange(color, 'font')} />
                )}
              </div>

              {/* Upload de arquivos */}
              <div className="form-group">
                <label className="label-white">Logo (Opcional):</label>
                <input type="file" onChange={handleLogoChange} className="form-control" />
              </div>
              <div className="form-group">
                <label className="label-white">Imagem de Fundo (Opcional):</label>
                <input type="file" onChange={handleBgImageChange} className="form-control" />
              </div>

              {/* Carrossel de imagens */}
              <div className="form-group">
                <label className="label-white">Carrossel de Imagens (3):</label>
                {carouselImages.map((image, index) => (
                  <div key={index} className="carousel-image-upload">
                    <input type="file" onChange={(e) => handleCarouselImageChange(index, e)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="button-container">
            <button className="glow-on-hover" type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardForm;
