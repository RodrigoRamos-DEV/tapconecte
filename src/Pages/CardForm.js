import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ChromePicker } from 'react-color';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './cardform.css';

const CardForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para dados do formulário
  const [formData, setFormData] = useState({
    name: '',
    instagram: '',
    facebook: '',
    whatsapp: '',
    phone: '',
    address: '',
    pixKey: '',
    website: '',
    about: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
    x: '',
    twitch: ''
  });

  // Estados para cores e imagens
  const [showColorPicker, setShowColorPicker] = useState({ bg: false, label: false, font: false });
  const [colors, setColors] = useState({
    bgColor: '#ffffff',
    labelBgColor: '#f0f0f0',
    fontColor: '#000000'
  });

  const [logo, setLogo] = useState('');
  const [bgImage, setBgImage] = useState('');
  const [carouselImages, setCarouselImages] = useState(['', '', '']);

  // Função para upload de imagens
  const handleImageUpload = async (file, type, index = null) => {
    if (!file || !user) return;

    try {
      // 1. Criar referência no Storage
      const storagePath = `usuarios/${user.uid}/${type}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);

      // 2. Fazer upload
      await uploadBytes(storageRef, file);

      // 3. Obter URL
      const downloadURL = await getDownloadURL(storageRef);

      // 4. Atualizar estado
      if (type === 'logo') {
        setLogo(downloadURL);
      } else if (type === 'bg') {
        setBgImage(downloadURL);
      } else if (type === 'carousel' && index !== null) {
        const newCarousel = [...carouselImages];
        newCarousel[index] = downloadURL;
        setCarouselImages(newCarousel);
      }

    } catch (error) {
      console.error('Erro no upload:', error);
      setError('Falha ao enviar imagem.');
    }
  };

  // Quando o usuário seleciona uma imagem
  const handleImageChange = (e, type, index = null) => {
    const file = e.target.files[0];
    if (!file) return;
    handleImageUpload(file, type, index);
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      setUser(currentUser);
      
      try {
        const userDoc = await getDoc(doc(db, 'usuarios', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Carregar dados do formulário
          if (userData.dadosCartao) {
            setFormData(userData.dadosCartao);
            setLogo(userData.dadosCartao.logo || '');
            setBgImage(userData.dadosCartao.bgImage || '');
            setCarouselImages(userData.dadosCartao.carouselImages || ['', '', '']);
          }

          // Carregar cores
          if (userData.colors) {
            setColors(userData.colors);
          }
        }
      } catch (error) {
        setError('Erro ao carregar dados: ' + error.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [navigate]);

  // Atualizar estado do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Atualizar cores
  const handleColorChange = (color, type) => {
    setColors(prev => ({ ...prev, [`${type}Color`]: color.hex }));
  };

  // Enviar dados
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (!user) throw new Error('Usuário não autenticado');

      // Preparar dados para salvar
      const userData = {
        dadosCartao: {
          ...formData,
          logo,
          bgImage,
          carouselImages
        },
        colors,
        lastUpdated: new Date().toISOString()
      };

      // Salvar no Firestore
      await updateDoc(doc(db, 'usuarios', user.uid), userData);
      
      setSuccess('Dados salvos com sucesso!');
      setTimeout(() => navigate(`/preview/${user.uid}`), 1500);
    } catch (error) {
      setError('Erro ao salvar: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="card-form-container">
      <h1>Configurar Seu Cartão Digital</h1>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit} className="card-form">
        {/* Seção de Informações Pessoais */}
        <div className="form-section">
          <h2>Informações Pessoais</h2>
          <div className="form-group">
            <label>Nome Completo*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* ... (mantenha todos os outros campos do formulário) */}
        </div>

        {/* Seção de Personalização */}
        <div className="form-section">
          <h2>Personalização</h2>
          
          {/* Upload de Logo */}
          <div className="form-group">
            <label>Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'logo')}
            />
            {logo && <img src={logo} alt="Pré-visualização do Logo" style={{ width: '100px', marginTop: '10px' }} />}
          </div>

          {/* Upload de Imagem de Fundo */}
          <div className="form-group">
            <label>Imagem de Fundo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'bg')}
            />
            {bgImage && <img src={bgImage} alt="Pré-visualização do Fundo" style={{ width: '100px', marginTop: '10px' }} />}
          </div>

          {/* Upload do Carrossel */}
          <div className="form-group">
            <label>Fotos do Carrossel (até 3)</label>
            {[0, 1, 2].map((index) => (
              <div key={index}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'carousel', index)}
                />
                {carouselImages[index] && <img src={carouselImages[index]} alt={`Carrossel ${index}`} style={{ width: '100px', marginTop: '10px' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="form-actions">
          <button type="submit" className="save-button">
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
};

export default CardForm;